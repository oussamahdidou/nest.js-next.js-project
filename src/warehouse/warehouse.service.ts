// warehouse.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { CreateWarehouseDto, UpdateWarehouseDto } from './dto/warehouse.dto';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {}

  async findById(id: number): Promise<Warehouse> {
    try {
      const options: FindOneOptions<Warehouse> = { where: { id } };
      return await this.warehouseRepository.findOneOrFail(options);
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Entrepôt non trouvé.');
    }
  }
  async findAll(): Promise<Warehouse[]> {
    try {
      return await this.warehouseRepository.find();
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Aucun entrepôt trouvé.');
    }
  }

  async create(createWarehouseDto: CreateWarehouseDto): Promise<Warehouse> {
    try {
      const warehouse = this.warehouseRepository.create(createWarehouseDto);
      return await this.warehouseRepository.save(warehouse);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        "Erreur lors de la création de l'entrepôt.",
      );
    }
  }

  async update(id, updateWarehouseDto: UpdateWarehouseDto): Promise<Warehouse> {
    try {
      const warehouse = await this.warehouseRepository.findOneOrFail(id);
      this.warehouseRepository.merge(warehouse, updateWarehouseDto);
      return this.warehouseRepository.save(warehouse);
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Entrepôt non trouvé.');
    }
  }

  async findWarehouses(warehouseIds: number[]): Promise<Warehouse[]> {
    const warehouses = await Promise.all(
      warehouseIds.map(async (id) => {
        const warehouse = await this.findById(id);
        if (!warehouse) {
          throw new NotFoundException(`Warehouse with ID ${id} not found`);
        }
        return warehouse;
      }),
    );

    return warehouses;
  }
}
