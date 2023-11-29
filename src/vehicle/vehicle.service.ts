import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver, Vehicle } from 'src/entities';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
  ) {}

  async create(
    createVehicleDto: CreateVehicleDto,
    userId: number,
  ): Promise<Vehicle> {
    const driver = await this.driverRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!driver) {
      // Handle the case where the driver is not found
      throw new NotFoundException(`Driver with id ${userId} not found`);
    }
    const vehicle = this.vehicleRepository.create({
      marque: createVehicleDto.marque,
      model: createVehicleDto.model,
      registrationNumber: createVehicleDto.registrationNumber,
      driver,
    });

    return this.vehicleRepository.save(vehicle);
  }

  async findAll(user_id: number) {
    const carList = await this.vehicleRepository.find({
      where: {
        driver: {
          id: user_id,
        },
      },
    });
    return carList;
  }

  findOne(id: number) {
    return `This action returns a #${id} vehicle`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateVehicleDto: UpdateVehicleDto) {
    return `This action updates a #${id} vehicle`;
  }

  remove(id: number) {
    return `This action removes a #${id} vehicle`;
  }
}
