import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Product } from '../product/entities/product.entity';
// import { Delivery } from './delivery.entity';

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

  // @ManyToOne(() => Delivery, (delivery) => delivery.packages)
  // delivery: Delivery;
}
