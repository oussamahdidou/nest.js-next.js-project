import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle, Driver, User } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, User, Driver])],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
