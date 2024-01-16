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
    userId: string,
  ): Promise<Vehicle> {
    const driver = await this.driverRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!driver) {
      throw new NotFoundException(`Driver with id ${userId} not found`);
    }
    const vehicle = this.vehicleRepository.create({
      ...createVehicleDto,
      driver,
    });

    return this.vehicleRepository.save(vehicle);
  }

  async findAll(user_id: string) {
    const carList = await this.vehicleRepository.find({
      where: {
        driver: {
          id: user_id,
        },
      },
    });
    return carList;
  }

  async findOne(id: number): Promise<Vehicle | undefined> {
    return this.vehicleRepository.findOneBy({ vehicle_id: id });
  }

  async update(
    id: number,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    const vehicle = await this.findOne(id);

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id ${id} not found`);
    }

    const updatedVehicle = this.vehicleRepository.merge(
      vehicle,
      updateVehicleDto,
    );

    return this.vehicleRepository.save(updatedVehicle);
  }

  async remove(id: number): Promise<void> {
    const vehicle = await this.findOne(id);

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id ${id} not found`);
    }

    await this.vehicleRepository.remove(vehicle);
  }
}
