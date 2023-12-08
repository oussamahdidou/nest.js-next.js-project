import { Module } from '@nestjs/common';
import { SupervisorService } from './supervisor.service';
import { SupervisorController } from './supervisor.controller';
import { WarehouseModule } from 'src/warehouse/warehouse.module';
import { User, Warehouse } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Supervisor } from 'src/entities/supervisor.entity';
import { WarehouseService } from 'src/warehouse/warehouse.service';

@Module({
  imports: [
    WarehouseModule,
    AuthModule,
    TypeOrmModule.forFeature([User, Supervisor, Warehouse]),
  ],
  controllers: [SupervisorController],
  providers: [SupervisorService, WarehouseService],
})
export class SupervisorModule {}
