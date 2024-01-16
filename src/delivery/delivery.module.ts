import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { Package } from 'src/entities/package.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  AvailableDriver,
  Vehicle,
  Warehouse,
  Driver,
  Delivery,
  Supervisor,
  Owner,
} from 'src/entities';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { WarehouseModule } from 'src/warehouse/warehouse.module';
import { WarehouseService } from 'src/warehouse/warehouse.service';
import { DriverService } from 'src/driver/driver.service';
import { PackageService } from 'src/package/package.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { PackageModule } from 'src/package/package.module';
import { AuthModule } from 'src/auth/auth.module';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports: [
    AuthModule,
    WarehouseModule,
    VehicleModule,
    PackageModule,
    TypeOrmModule.forFeature([
      User,
      Driver,
      AvailableDriver,
      Supervisor,
      Vehicle,
      Warehouse,
      Package,
      Product,
      Owner,
      Delivery,
    ]),
  ],
  controllers: [DeliveryController],
  providers: [
    DeliveryService,
    WarehouseService,
    VehicleService,
    PackageService,
    DriverService,
    ProductService,
  ],
})
export class DeliveryModule {}
