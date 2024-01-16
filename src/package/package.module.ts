import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from '../entities/package.entity';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';
import { Owner, Supervisor, Warehouse } from 'src/entities';
import { Product } from 'src/product/entities/product.entity';
import { ProductModule } from 'src/product/product.module';
import { ProductService } from 'src/product/product.service';
import { WarehouseService } from 'src/warehouse/warehouse.service';

@Module({
  imports: [
    ProductModule,
    TypeOrmModule.forFeature([Package, Supervisor, Product, Owner, Warehouse]),
  ],
  controllers: [PackageController],
  providers: [PackageService, ProductService, WarehouseService],
})
export class PackageModule {}
