
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from 'src/entities/payment.entity';
import { PaypalService } from './paypal.service';


@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  providers: [PaymentService,PaypalService],
  controllers: [PaymentController],
})
export class PaymentModule {}