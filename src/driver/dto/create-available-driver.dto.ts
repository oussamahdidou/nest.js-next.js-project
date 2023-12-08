// src/driver/dto/create-available-driver.dto.ts

import { IsInt, IsNotEmpty, IsArray, IsDateString } from 'class-validator';

export class CreateAvailableDriverDto {
  @IsInt()
  @IsNotEmpty()
  vehicleId: number;

  @IsDateString()
  @IsNotEmpty()
  startTime: Date;

  @IsDateString()
  @IsNotEmpty()
  endTime: Date;

  @IsNotEmpty()
  availableVolume: number;

  @IsNotEmpty()
  availableWeight: number;

  @IsNotEmpty()
  startWarehouse: number;

  @IsNotEmpty()
  destination: number;

  @IsArray()
  warehouses: number[];
}
