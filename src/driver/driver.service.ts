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
  async removeOutdatedAvailableDrivers() {
    const currentDate = new Date();
    await this.availableDriverRepository
      .createQueryBuilder()
      .delete()
      .from(AvailableDriver)
      .where('startTime < :currentDate', { currentDate })
      .execute();
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
      const availability = this.availableDriverRepository.create({
        ...createAvailabilityDto,
        vehicle,
        startWarehouse,
        destination,
        waypoints,
      });
      return await this.availableDriverRepository.save(availability);
    } catch (error) {
      // Handle errors, log or throw a custom exception
      console.error(`Error mentioning availability: ${error.message}`);
      throw new Error('Failed to mention availability');
    }
  }

  async sortAvailableDrivers(): Promise<AvailableDriver[]> {
    const availableDrivers = await this.availableDriverRepository.find();

    // Sort drivers based on calculated score
    const sortedDrivers = availableDrivers.sort((a, b) => {
      const scoreA = this.calculateDriverScore(a);
      const scoreB = this.calculateDriverScore(b);

      // Sort in descending order
      return scoreB - scoreA;
    });

    return sortedDrivers;
  }

  calculateDriverScore(a: AvailableDriver): number {
    // Coefficients for different factors
    const lengthCoefficient = 1 / 8;
    const availableWeightCoefficient = 1 / 8;
    const availableVolumeCoefficient = 1 / 8;
    const scoreCoefficient = 3 / 8;
    const penaltyCoefficient = -(2 / 8);

    // Calculate the score for the driver
    const score =
      lengthCoefficient * a.waypoints.length +
      availableWeightCoefficient * a.availableWeight +
      availableVolumeCoefficient * a.availableVolume +
      scoreCoefficient * a.vehicle.driver.score +
      penaltyCoefficient * a.vehicle.driver.penalty;

    return score;
  }
}
