import { Module } from '@nestjs/common';
import { SupervisorService } from './supervisor.service';
import { SupervisorController } from './supervisor.controller';
import { WarehouseModule } from 'src/warehouse/warehouse.module';
import {
  AvailableDriver,
  Delivery,
  Driver,
  Owner,
  User,
  Vehicle,
  Warehouse,
} from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Supervisor } from 'src/entities/supervisor.entity';
import { WarehouseService } from 'src/warehouse/warehouse.service';
import { DeliveryModule } from 'src/delivery/delivery.module';
import { EvaluationDelivery } from 'src/entities/evaluation-delivery.entity';
import { DeliveryService } from 'src/delivery/delivery.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { PackageService } from 'src/package/package.service';
import { DriverService } from 'src/driver/driver.service';
import { Package } from 'src/entities/package.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';

@Module({
  imports: [
    WarehouseModule,
    AuthModule,
    DeliveryModule,
    TypeOrmModule.forFeature([
      User,
      Driver,
      Supervisor,
      Owner,
      AvailableDriver,
      Warehouse,
      Delivery,
      Vehicle,
      EvaluationDelivery,
      Package,
      Product,
    ]),
  ],
  controllers: [SupervisorController],
  providers: [
    SupervisorService,
    WarehouseService,
    DeliveryService,
    VehicleService,
    PackageService,
    DriverService,
    ProductService,
  ],
})
export class SupervisorModule {}
