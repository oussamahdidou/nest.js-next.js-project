import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { Payment } from 'src/entities/payment.entity';


@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find();
  }

  async findById(paymentId: number): Promise<Payment | undefined> {
    try {
      const options: FindOneOptions<Payment> = { where: { paymentId } };
      return await this.paymentRepository.findOneOrFail(options);
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Payment not found.');
    }
  }
  
  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const newPayment = this.paymentRepository.create(createPaymentDto);
    return this.paymentRepository.save(newPayment);
  }
  

  async update(paymentId, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    try {
      const options: FindOneOptions<Payment> = { where: { paymentId } };
      const payment = await this.paymentRepository.findOneOrFail(options);
      this.paymentRepository.merge(payment, updatePaymentDto);
      return this.paymentRepository.save(payment);
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Payment not found.');
    }
  }
  
  
  async remove(paymentId: number): Promise<void> {
    await this.paymentRepository.delete(paymentId);
  }
}