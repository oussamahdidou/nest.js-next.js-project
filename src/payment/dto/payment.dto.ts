import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  status: string;
}
export class UpdatePaymentDto {
    @IsOptional()
    @IsNumber()
    amount?: number;
  
    @IsOptional()
    @IsString()
    currency?: string;
  
    @IsOptional()
    @IsString()
    status?: string;
  }
