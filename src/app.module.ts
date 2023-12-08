import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { OwnerModule } from './owner/owner.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { ConfigModule } from '@nestjs/config';
import { DriverModule } from './driver/driver.module';
import { PackageModule } from './package/package.module';
import { ProductModule } from './product/product.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { DeliveryModule } from './delivery/delivery.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SupervisorModule } from './supervisor/supervisor.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'yourways',
      password: '123456',
      database: 'yourways_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    DriverModule,
    OwnerModule,
    VehicleModule,
    PackageModule,
    ProductModule,
    WarehouseModule,
    DeliveryModule,
    SupervisorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
