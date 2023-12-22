import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { Payment } from 'src/entities/payment.entity';


@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  findAll(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') paymentId: string): Promise<Payment> {
    return this.paymentService.findById(Number(paymentId));
  }

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentService.create(createPaymentDto);
  }

  @Put(':id')
  update(@Param('id') paymentId: string, @Body() updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    return this.paymentService.update(Number(paymentId), updatePaymentDto);
  }
  @Delete(':id')
  remove(@Param('id') paymentId: string): Promise<void> {
    return this.paymentService.remove(Number(paymentId));
  }
}