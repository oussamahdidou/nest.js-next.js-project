import { Injectable } from '@nestjs/common';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { AuthService } from '../auth/auth.service';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Owner } from 'src/entities';
import { Repository } from 'typeorm';
@Injectable()
export class OwnerService {
  constructor(
    private authService: AuthService,
    @InjectRepository(Owner)
    private ownerRepository: Repository<Owner>,
  ) {}

  async create(createOwnerDto: CreateOwnerDto) {
    return this.authService.signupOwner(createOwnerDto);
  }

  async findAll(): Promise<Owner[]> {
    return this.ownerRepository.find();
  }

  async findOne(id: string): Promise<Owner> {
    const owner = await this.ownerRepository.findOneBy({ id });
    if (!owner) {
      throw new NotFoundException(`Owner with id ${id} not found`);
    }
    return owner;
  }

  async update(id: string, updateOwnerDto: UpdateOwnerDto): Promise<Owner> {
    const owner = await this.findOne(id);
    if (!owner) {
      throw new NotFoundException(`Owner with id ${id} not found`);
    }

    Object.assign(owner, updateOwnerDto);

    return this.ownerRepository.save(owner);
  }

  async remove(id: string): Promise<void> {
    const owner = await this.findOne(id);
    await this.ownerRepository.remove(owner);
  }
}
