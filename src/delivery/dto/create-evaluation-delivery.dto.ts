import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { PackageEtat } from 'src/enumerations/package-etat.enum';

export class CreateEvaluationDeliveryDto {
  @IsNotEmpty()
  @IsNumber()
  deliveryId: number;

  @IsNotEmpty()
  @IsString()
  packageEtat: PackageEtat;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  score: number;

  @IsString()
  comment: string;

  @IsNumber()
  delay: number;
}
