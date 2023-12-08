// warehouse.dto.ts

import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  city: string;

  @IsString()
  location: string;
}

export class UpdateWarehouseDto {
  @IsString()
  city: string;

  @IsString()
  location: string;
}

export class GetByIdDto {
  @IsNotEmpty()
  @IsInt()
  id: string;
}
