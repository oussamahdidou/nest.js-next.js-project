import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { UpdateSupervisorDto } from './dto/update-supervisor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supervisor } from 'src/entities/supervisor.entity';
import { Equal, Repository } from 'typeorm';
import { WarehouseService } from 'src/warehouse/warehouse.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateEvaluationDeliveryDto } from 'src/delivery/dto/create-evaluation-delivery.dto';
import { EvaluationDelivery } from 'src/entities/evaluation-delivery.entity';
import { DeliveryService } from 'src/delivery/delivery.service';
import { PackageEtat } from 'src/enumerations/package-etat.enum';
import { Product } from 'src/product/entities/product.entity';
import { ProductStatus } from 'src/enumerations/product-status.enum';
import { Package } from 'src/entities/package.entity';

@Injectable()
export class SupervisorService {
  constructor(
    @InjectRepository(Supervisor)
    private supervisorRepository: Repository<Supervisor>,
    @InjectRepository(EvaluationDelivery)
    private evaluationDeliveryRepository: Repository<EvaluationDelivery>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    private warehouseService: WarehouseService,
    private authService: AuthService,
    private deliveryService: DeliveryService,
  ) {}

  async create(dto: CreateSupervisorDto) {
    return await this.authService.signupSupervisor(dto);
  }

  findAll(): Promise<Supervisor[]> {
    return this.supervisorRepository.find();
  }

  async findOne(id: string) {
    const supervisor = await this.supervisorRepository.findOne({
      where: {
        id,
      },
      relations: ['warehouse'],
    });

    if (!supervisor) {
      throw new NotFoundException(`Supervisor with id ${id} not found`);
    }

    return supervisor;
  }

  async update(
    id: string,
    updateSupervisorDto: UpdateSupervisorDto,
  ): Promise<Supervisor> {
    const supervisor = await this.findOne(id);
    this.supervisorRepository.merge(supervisor, updateSupervisorDto);
    return this.supervisorRepository.save(supervisor);
  }

  async remove(id: string): Promise<void> {
    const supervisor = await this.findOne(id);
    await this.supervisorRepository.remove(supervisor);
  }

  async evaluateDelivery(
    supervisorId: string,
    evaluationDto: CreateEvaluationDeliveryDto,
  ) {
    const supervisor = await this.findOne(supervisorId);
    if (!supervisor) {
      throw new NotFoundException(
        `Supervisor with id ${supervisorId} not found`,
      );
    }

    const delivery = await this.deliveryService.findOne(
      evaluationDto.deliveryId,
    );
    if (!delivery) {
      throw new NotFoundException(
        `Delivery with id ${evaluationDto.deliveryId} not found`,
      );
    }
    const score = this.calculateDeliveryScore(
      evaluationDto.packageEtat,
      evaluationDto.delay,
    );

    const evaluation = await this.evaluationDeliveryRepository.create({
      delay: evaluationDto.delay,
      packageEtat: evaluationDto.packageEtat,
      comment: evaluationDto.comment,
      score,
      delivery,
      supervisor,
    });

    return await this.evaluationDeliveryRepository.save(evaluation);
  }

  calculateDeliveryScore(packageEtat: PackageEtat, delay: number): number {
    let score = 0;

    switch (packageEtat) {
      case 'Good':
        score += 5;
        break;
      case 'Slightly Damaged':
        score += 2;
        break;
      case 'Damaged':
        score += 0;
        break;
    }

    if (delay <= 1) {
      score += 5;
    } else if (delay <= 4) {
      score += 2;
    } else {
      score += 0;
    }
    return score;
  }

  async findProductsInWarehouse(user_id: string): Promise<Product[]> {
    const supervisor = await this.findOne(user_id);

    if (!supervisor || !supervisor.warehouse || !supervisor.warehouse.id) {
      throw new Error('Supervisor or warehouse not found or has no ID');
    }

    const warehouseId = supervisor.warehouse.id;

    const products = await this.productRepository.find({
      where: {
        startWarehouse: Equal(warehouseId),
        status: ProductStatus.InStock,
      },
      relations: ['startWarehouse'],
    });

    return products;
  }

  async findPackagesBySupervisor(supervisorId: string): Promise<Package[]> {
    const supervisor = await this.findOne(supervisorId);

    if (!supervisor) {
      throw new NotFoundException(
        `Supervisor with ID ${supervisorId} not found`,
      );
    }

    return this.packageRepository.find({
      where: {
        creator: { id: supervisor.id },
      },
      relations: ['creator', 'products'],
    });
  }
}
