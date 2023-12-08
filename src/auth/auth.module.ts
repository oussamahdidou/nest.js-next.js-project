import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import {
  Driver,
  Owner,
  Supervisor,
  User,
  Vehicle,
  Warehouse,
} from '../entities';
import { WarehouseModule } from 'src/warehouse/warehouse.module';
import { WarehouseService } from 'src/warehouse/warehouse.service';

@Module({
  imports: [
    WarehouseModule,
    TypeOrmModule.forFeature([
      User,
      Driver,
      Owner,
      Vehicle,
      Supervisor,
      Warehouse,
    ]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, WarehouseService],
  exports: [AuthService],
})
export class AuthModule {}
