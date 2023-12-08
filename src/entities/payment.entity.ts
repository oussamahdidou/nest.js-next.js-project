// payment.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  paymentId: number;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  status: string;
}