import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package } from '../entities/package.entity';
import {
  CreatePackageDto,
  UpdatePackageDto,
} from './dto/create-update-package.dto';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
  ) {}

  async findAll() {
    return this.packageRepository.find({ relations: ['products'] });
  }

  async findOne(id: number): Promise<Package | undefined> {
    const foundPackage = await this.packageRepository.findOneById(id);
    if (!foundPackage) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
    return foundPackage;
  }

  create(createPackageDto: CreatePackageDto) {
    const newPackage = this.packageRepository.create(createPackageDto);
    return this.packageRepository.save(newPackage);
  }

  async update(id: number, updatePackageDto: UpdatePackageDto) {
    const updatedPackage = await this.packageRepository.preload({
      id: +id,
      ...updatePackageDto,
    });
    return this.packageRepository.save(updatedPackage);
  }

  async remove(id: number) {
    const deleteResult = await this.packageRepository.delete(id);
    return deleteResult.affected > 0;
  }
}
