// warehouse.dto.ts

import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  city: string;

  @IsString()
  location: any;
}

export class UpdateWarehouseDto {
  @IsString()
  city: string;

  @IsString()
  location: any;
}

export class GetByIdDto {
  @IsNotEmpty()
  @IsInt()
  id: string;
}
