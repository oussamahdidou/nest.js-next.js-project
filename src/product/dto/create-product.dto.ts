import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  price: number;
  @IsNotEmpty()
  fragility: boolean;
  @IsNotEmpty()
  weight: number;
  @IsNotEmpty()
  dimensions: number;
  @IsNotEmpty()
  deliveryDate: Date;
  @IsNotEmpty()
  startWarehouse: number;
  @IsNotEmpty()
  destination: number;
}
