
import { Injectable, NotFoundException } from '@nestjs/common';
import * as paypal from 'paypal-rest-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from 'src/entities/payment.entity';

@Injectable()
export class PaypalService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {
    paypal.configure({
      mode: 'sandbox',
      client_id: 'AV3n8NYEyGlBpkNIeL8DFfUpiCEENZUJbMJmnYuS0e-Y48BdB3owWiwcsS5FIhNRmq_KnTiZO2L4yD5K',
      client_secret: 'EKpklqlCUUELJfIKefNvTNijf5UrG1P8_bQr1ZWPjzU0dNmhn8OHfNOkkSv0D9l_ZC6GplwnE54Z6JB3',
    });
  }

  async createPayment(): Promise<string> {
    const createPaymentJson = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: 'Item Name',
                sku: 'Item SKU',
                price: '10.00',
                currency: 'USD',
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: 'USD',
            total: '10.00',
          },
          description: 'This is the payment description.',
        },
      ],
    };

    try {
      const payment = await new Promise<string>((resolve, reject) => {
        paypal.payment.create(createPaymentJson, (error, payment) => {
          if (error) {
            console.error('PayPal Create Payment Error:', error);
            reject(error);
          } else {
            console.log('PayPal Create Payment Response:', payment);
            this.savePaymentDetails(payment);
            resolve(payment.links.find((link) => link.rel === 'approval_url').href);
          }
        });
      });

      return payment;
    } catch (error) {
      console.error('Payment creation failed:', error.message);
      throw new NotFoundException('Le paiement a échoué. Veuillez réessayer.');
    }
  }

  private async savePaymentDetails(payment: any): Promise<void> {
    const newPayment = this.paymentRepository.create({
      amount: parseFloat(payment.transactions[0].amount.total),
      currency: payment.transactions[0].amount.currency,
      status: payment.state,
    });

    await this.paymentRepository.save(newPayment);
  }
  async executePayment(paymentId: string, payerId: string): Promise<any> {
    const executePaymentJson = {
      payer_id: payerId,
    };

    try {
      const executedPayment = await new Promise<any>((resolve, reject) => {
        paypal.payment.execute(paymentId, executePaymentJson, (error, payment) => {
          if (error) {
            reject(error);
          } else {
            resolve(payment);
          }
        });
      });

      return executedPayment;
    } catch (error) {
      throw new NotFoundException('Payment execution failed.');
    }
  }
}

