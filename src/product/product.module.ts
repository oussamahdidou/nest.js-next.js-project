import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import {
  AvailableDriver,
  Delivery,
  Driver,
  Owner,
  Supervisor,
  User,
  Vehicle,
  Warehouse,
} from 'src/entities';
import { WarehouseModule } from 'src/warehouse/warehouse.module';
import { WarehouseService } from 'src/warehouse/warehouse.service';
import { SupervisorService } from 'src/supervisor/supervisor.service';
import { EvaluationDelivery } from 'src/entities/evaluation-delivery.entity';
import { AuthService } from 'src/auth/auth.service';
import { DeliveryService } from 'src/delivery/delivery.service';
import { JwtService } from '@nestjs/jwt';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { PackageService } from 'src/package/package.service';
import { DriverService } from 'src/driver/driver.service';
import { Package } from 'src/entities/package.entity';

@Module({
  imports: [
    WarehouseModule,
    TypeOrmModule.forFeature([
      Product,
      Owner,
      Supervisor,
      Warehouse,
      EvaluationDelivery,
      User,
      Driver,
      Delivery,
      Vehicle,
      Package,
      AvailableDriver,
    ]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    WarehouseService,
    SupervisorService,
    AuthService,
    DeliveryService,
    JwtService,
    VehicleService,
    PackageService,
    DriverService,
  ],
})
export class ProductModule {}
