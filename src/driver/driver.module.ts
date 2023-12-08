import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AvailableDriver,
  Driver,
  User,
  Vehicle,
  Warehouse,
} from 'src/entities';
import { WarehouseModule } from 'src/warehouse/warehouse.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { WarehouseService } from 'src/warehouse/warehouse.service';
import { VehicleService } from 'src/vehicle/vehicle.service';

@Module({
  imports: [
    AuthModule,
    WarehouseModule,
    VehicleModule,
    TypeOrmModule.forFeature([
      User,
      Driver,
      AvailableDriver,
      Vehicle,
      Warehouse,
    ]),
  ],
  controllers: [DriverController],
  providers: [DriverService, WarehouseService, VehicleService],
})
export class DriverModule {}
