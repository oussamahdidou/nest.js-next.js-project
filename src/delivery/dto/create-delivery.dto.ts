import {
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { DeliveryStatus } from 'src/enumerations/delivery-status.enum';

export class CreateDeliveryDto {
  @IsNotEmpty()
  @IsNumber()
  availableDriverId: number;

  @IsArray()
  packages: number[];

  @IsNumber()
  startWarehouse: number;

  @IsNumber()
  endWarehouse: number;

  @IsArray()
  waypoints: number[];

  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;

  @IsEnum(DeliveryStatus)
  @IsOptional()
  status: DeliveryStatus = DeliveryStatus.PENDING;
}
