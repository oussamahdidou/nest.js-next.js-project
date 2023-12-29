import { Controller, Get, Post, Body, Param, Put, Delete, Res ,Req} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { Payment } from 'src/entities/payment.entity';
import { PaypalService } from './paypal.service'; 

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly paypalService: PaypalService, 
  ) {}

  @Get()
  findAll(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') paymentId: string): Promise<Payment> {
    return this.paymentService.findById(Number(paymentId));
  }

  @Post('create-payment')
  async createPayment(@Res() res): Promise<void> {
    try {
      const approvalUrl = await this.paypalService.createPayment();
      console.log('Approval URL:', approvalUrl);

      // Rediriger l'utilisateur vers l'URL d'approbation PayPal
      return res.redirect(approvalUrl);
    } catch (error) {
      console.error('Erreur lors de la création du paiement PayPal:', error);
      // Gérer les erreurs de création du paiement
      return res.redirect('/error');
    }
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
