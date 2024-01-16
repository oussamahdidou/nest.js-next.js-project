import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package } from '../entities/package.entity';
import {
  CreatePackageDto,
  UpdatePackageDto,
} from './dto/create-update-package.dto';
import { Supervisor } from 'src/entities';
import { ProductService } from 'src/product/product.service';
import { ProductStatus } from 'src/enumerations/product-status.enum';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    @InjectRepository(Supervisor)
    private readonly supervisorRepository: Repository<Supervisor>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private productService: ProductService,
  ) {}

  async findAll() {
    return this.packageRepository.find({ relations: ['products'] });
  }

  async findOne(id: number): Promise<Package | undefined> {
    const foundPackage = await this.packageRepository.findOneBy({
      packageId: id,
    });
    if (!foundPackage) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
    return foundPackage;
  }

  async create(user_id: string, createPackageDto: CreatePackageDto) {
    const supervisor = await this.supervisorRepository.findOne({
      where: { id: user_id },
    });
    if (!supervisor) {
      throw new NotFoundException(`Supervisor with id ${user_id} not found`);
    }

    const products = await this.productService.findProducts(
      createPackageDto.products,
    );
    if (!products) {
      throw new NotFoundException(`products not found`);
    }

    products.forEach((product) => {
      product.status = ProductStatus.InPackage;
    });

    const newPackage = this.packageRepository.create({
      ...createPackageDto,
      products: products,
      creator: supervisor,
    });
    await this.productRepository.save(products);
    return this.packageRepository.save(newPackage);
  }

  async update(id: number, updatePackageDto: UpdatePackageDto) {
    const existingPackage = await this.packageRepository.findOne({
      where: {
        packageId: id,
      },
    });

    if (!existingPackage) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
    Object.assign(existingPackage, updatePackageDto);

    return this.packageRepository.save(existingPackage);
  }

  async remove(id: number) {
    const deleteResult = await this.packageRepository.delete(id);
    return deleteResult.affected > 0;
  }

  async findPackages(PackageIds: number[]): Promise<Package[]> {
    const packages = await Promise.all(
      PackageIds.map(async (id) => {
        const packagee = await this.findOne(id);
        if (!packagee) {
          throw new NotFoundException(`Warehouse with ID ${id} not found`);
        }
        return packagee;
      }),
    );

    return packages;
  }
}
