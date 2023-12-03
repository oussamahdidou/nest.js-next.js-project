// warehouse.controller.ts

import { Controller, Get, Param, Post, Body, Put, ParseIntPipe } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from '../entities/warehouse.entity';
import { CreateWarehouseDto, GetByIdDto, UpdateWarehouseDto } from './dto/warehouse.dto';


@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}
  @Get()
  findAll(): Promise<Warehouse[]> {
    return this.warehouseService.findAll();
  }
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<Warehouse | undefined> {
    return this.warehouseService.findById(id);
  }

  @Post()
  create(@Body() createWarehouseDto: CreateWarehouseDto): Promise<Warehouse> {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateWarehouseDto: UpdateWarehouseDto): Promise<Warehouse> {
    return this.warehouseService.update(id, updateWarehouseDto);
  }
}
