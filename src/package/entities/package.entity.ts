
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Package {
  @PrimaryGeneratedColumn()
  packageId: number;

  @Column({ type: 'float' })
  weight: number;

  @Column({ type: 'float' })
  dimensions: number;

  @OneToMany(() => Product, product => product.package)
  products: Product[];
}
