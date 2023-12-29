import { Injectable } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Delivery } from 'src/entities';
import { Repository } from 'typeorm';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { WarehouseService } from 'src/warehouse/warehouse.service';
import { PackageService } from 'src/package/package.service';
import { DriverService } from 'src/driver/driver.service';
import { DeliveryStatus } from 'src/enumerations/delivery-status.enum';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
    private waerhoseService: WarehouseService,
    private vehicleService: VehicleService,
    private packageService: PackageService,
    private driverService: DriverService,
  ) {}

  async create(createDeliveryDto: CreateDeliveryDto) {
    try {
      const startWarehouse = await this.waerhoseService.findById(
        createDeliveryDto.startWarehouse,
      );
      const endWarehouse = await this.waerhoseService.findById(
        createDeliveryDto.endWarehouse,
      );
      const waypoints = await this.waerhoseService.findWarehouses(
        createDeliveryDto.waypoints,
      );
      const packages = await this.packageService.findPackages(
        createDeliveryDto.packages,
      );
      const availableDriver = await this.driverService.findOneavAilableDriver(
        createDeliveryDto.availableDriverId,
      );
      const delivery = this.deliveryRepository.create({
        ...createDeliveryDto,
        availableDriver,
        packages,
        startWarehouse,
        endWarehouse,
        waypoints,
      });
      return await this.deliveryRepository.save(delivery);
    } catch (error) {
      // Handle errors, log or throw a custom exception
      console.error(`Error mentioning availability: ${error.message}`);
      throw new Error('Failed to mention availability');
    }
  }

  async findAll(): Promise<Delivery[]> {
    return this.deliveryRepository.find();
  }

  async findOne(deliveryId: number) {
    try {
      const delivery = await this.deliveryRepository.findOneBy({
        delivery_id: deliveryId,
      });
      if (!delivery) {
        throw new NotFoundException(`Delivery with id ${deliveryId} not found`);
      }
      return delivery;
    } catch (error) {
      throw new NotFoundException(`Failed to find delivery: ${error.message}`);
    }
  }

  async remove(deliveryId: number) {
    try {
      const delivery = await this.findOne(deliveryId);
      return this.deliveryRepository.remove(delivery);
    } catch (error) {
      throw new NotFoundException(
        `Failed to remove delivery: ${error.message}`,
      );
    }
  }

  async updateDelevryStatus(id: number, status: DeliveryStatus) {
    const delivery = await this.findOne(id);

    if (!delivery) {
      throw new NotFoundException(`Delivery with id ${id} not found`);
    }
    switch (status) {
      case 'IN_PROGRESS':
        delivery.startTime = new Date();
        break;
      case 'COMPLETED':
        delivery.endTime = new Date();
        break;
    }
    delivery.status = status;
    await this.deliveryRepository.save(delivery);
  }
}
