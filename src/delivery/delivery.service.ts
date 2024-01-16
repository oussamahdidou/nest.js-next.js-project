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
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

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
      console.error(`Error Creating the delivery: ${error.message}`);
      throw new Error('Failed to Creating the delivery');
    }
  }

  async findAll() {
    return await this.deliveryRepository.find({
      relations: [
        'availableDriver',
        'startWarehouse',
        'endWarehouse',
        'waypoints',
        'evaluations',
      ],
    });
  }

  async findMyAll(user_id: string): Promise<Delivery[]> {
    const deliveries = await this.deliveryRepository
      .createQueryBuilder('delivery')
      .innerJoin('delivery.availableDriver', 'availableDriver')
      .innerJoin('availableDriver.vehicle', 'vehicle')
      .innerJoin('vehicle.driver', 'driver')
      .where('driver.id = :user_id', { user_id })
      .getMany();

    return deliveries;
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

  async update(id: number, updateDeliveryDto: UpdateDeliveryDto) {
    const delivery = await this.findOne(id);

    if (!delivery) {
      throw new NotFoundException(`Delivery with id ${id} not found`);
    }

    const packages = await this.packageService.findPackages(
      updateDeliveryDto.packages,
    );
    const waypoints = await this.waerhoseService.findWarehouses(
      updateDeliveryDto.waypoints,
    );
    const startWarehouse = await this.waerhoseService.findById(
      updateDeliveryDto.startWarehouse,
    );
    const endWarehouse = await this.waerhoseService.findById(
      updateDeliveryDto.endWarehouse,
    );
    this.deliveryRepository.merge(delivery, {
      ...updateDeliveryDto,
      packages,
      waypoints,
      startWarehouse,
      endWarehouse,
    });

    await this.deliveryRepository.save(delivery);
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
