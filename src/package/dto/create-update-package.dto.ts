import { IsNotEmpty, IsArray } from 'class-validator';

export class CreatePackageDto {
  @IsNotEmpty()
  weight: number;
  @IsNotEmpty()
  dimensions: number;
  @IsArray()
  products: number[];
}

export class UpdatePackageDto {
  weight?: number;
  dimensions?: number;
  products?: number[];
}
