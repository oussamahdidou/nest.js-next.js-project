import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsEnum,
  IsOptional,
  IsDateString,
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

  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;

  @IsEnum(DeliveryStatus)
  status: DeliveryStatus = DeliveryStatus.PENDING;
}
