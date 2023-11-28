import { Injectable } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { AuthService } from '../auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from 'src/entities';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver) private driverRepository: Repository<Driver>,
    private authService: AuthService,
  ) {}

  create(createDriverDto: CreateDriverDto) {
    return this.authService.signupDriver(createDriverDto);
  }

  findAll() {
    return this.driverRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} driver`;
  }

  update(id: number, updateDriverDto: UpdateDriverDto) {
    return `This action updates a #${id} driver`;
  }

  remove(id: number) {
    return `This action removes a #${id} driver`;
  }
}
