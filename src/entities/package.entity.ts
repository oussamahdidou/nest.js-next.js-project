import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { Delivery } from './delivery.entity';
import { Supervisor } from './supervisor.entity';

@Entity()
export class Package {
  @PrimaryGeneratedColumn()
  packageId: number;

  @Column({ type: 'float' })
  weight: number;

  @Column({ type: 'float' })
  dimensions: number;

  @OneToMany(() => Product, (product) => product.package)
  products: Product[];

  @ManyToOne(() => Delivery, (delivery) => delivery.packages, {
    onDelete: 'SET NULL',
  })
  delivery: Delivery;

  @ManyToOne(() => Supervisor, (supervisor) => supervisor.packages)
  creator: Supervisor;
}
