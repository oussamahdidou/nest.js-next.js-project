import { Injectable } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { AuthService } from '../auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvailableDriver, Driver } from 'src/entities';
import { NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateAvailableDriverDto } from './dto/create-available-driver.dto';
import { WarehouseService } from 'src/warehouse/warehouse.service';
import { VehicleService } from 'src/vehicle/vehicle.service';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver) private driverRepository: Repository<Driver>,
    @InjectRepository(AvailableDriver)
    private availableDriverRepository: Repository<AvailableDriver>,
    private authService: AuthService,
    private waerhoseService: WarehouseService,
    private vehicleService: VehicleService,
  ) {}
  // start CRUD service
  async create(createDriverDto: CreateDriverDto) {
    return this.authService.signupDriver(createDriverDto);
  }

  findAll() {
    return this.driverRepository.find();
  }

  async findOne(id: string) {
    const driver = await this.driverRepository.findOneBy({ id });

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }

    return driver;
  }

  async update(id: string, updateDriverDto: UpdateDriverDto) {
    const existingDriver = await this.findOne(id);
    const updatedDriver = this.driverRepository.merge(
      existingDriver,
      updateDriverDto,
    );
    return this.driverRepository.save(updatedDriver);
  }

  async remove(id: string) {
    const driver = await this.findOne(id);

    await this.driverRepository.remove(driver);

    return { message: `Driver with ID ${id} successfully removed` };
  }

  // end CRUD operations
  @Cron(CronExpression.EVERY_MINUTE)
  async archiveOutdatedAvailableDrivers() {
    const currentDate = new Date();
    await this.availableDriverRepository
      .createQueryBuilder()
      .update(AvailableDriver)
      .set({ archived: true })
      .where('startTime < :currentDate', { currentDate })
      .execute();
  }

  async findOneavAilableDriver(available_driver_id: number) {
    const available_driver = await this.availableDriverRepository.findOneBy({
      available_driver_id,
    });
    if (!available_driver) {
      throw new NotFoundException(
        `Driver with ID ${available_driver} not found`,
      );
    }

    return available_driver;
  }

  async mentionAvailability(createAvailabilityDto: CreateAvailableDriverDto) {
    try {
      const startWarehouse = await this.waerhoseService.findById(
        createAvailabilityDto.startWarehouse,
      );
      const destination = await this.waerhoseService.findById(
        createAvailabilityDto.destination,
      );
      const waypoints = await this.waerhoseService.findWarehouses(
        createAvailabilityDto.warehouses,
      );
      const vehicle = await this.vehicleService.findOne(
        createAvailabilityDto.vehicleId,
      );

      if (!startWarehouse) {
        throw new Error('Start warehouse not found');
      }

      if (!destination) {
        throw new Error('Destination warehouse not found');
      }

      if (!vehicle) {
        throw new Error('Vehicle not found');
      }

      const availability = this.availableDriverRepository.create({
        ...createAvailabilityDto,
        vehicle,
        startWarehouse,
        destination,
        waypoints,
      });

      return await this.availableDriverRepository.save(availability);
    } catch (error) {
      console.error(`Error mentioning availability: ${error.message}`);
      throw new Error('Failed to mention availability');
    }
  }

  async getNonArchivedAvailableDrivers() {
    try {
      const drivers = await this.availableDriverRepository.find({
        where: { archived: false },
        select: [
          'available_driver_id',
          'startTime',
          'endTime',
          'availableVolume',
          'availableWeight',
          'archived',
        ],
        relations: [
          'vehicle',
          'startWarehouse',
          'destination',
          'waypoints',
          'delivery',
        ],
      });

      console.log('Available Drivers:', drivers);
      return drivers;
    } catch (error) {
      console.error('Error fetching available drivers:', error);
      throw error;
    }
  }

  async sortAvailableDrivers() {
    const availableDrivers = await this.getNonArchivedAvailableDrivers();

    const sortedDrivers = availableDrivers.sort((a, b) => {
      const scoreA = this.calculateDriverScore(a);
      const scoreB = this.calculateDriverScore(b);

      return scoreB - scoreA;
    });

    return sortedDrivers;
  }

  calculateDriverScore(a: AvailableDriver): number {
    const lengthCoefficient = 1 / 8;
    const availableWeightCoefficient = 1 / 8;
    const availableVolumeCoefficient = 1 / 8;
    const scoreCoefficient = 3 / 8;
    const penaltyCoefficient = -(2 / 8);

    const score =
      lengthCoefficient * a.waypoints.length +
      availableWeightCoefficient * a.availableWeight +
      availableVolumeCoefficient * a.availableVolume +
      scoreCoefficient * a.vehicle.driver.score +
      penaltyCoefficient * a.vehicle.driver.penalty;

    return score;
  }
}
