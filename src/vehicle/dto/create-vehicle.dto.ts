// create-vehicle.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';
// import { Driver } from 'src/entities';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  marque: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsString()
  registrationNumber: string;
}
