import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Package } from 'src/package/entities/package.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column()
  name: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'boolean' })
  fragility: boolean;

  @Column({ type: 'float' })
  weight: number;

  @Column({ type: 'float' })
  dimensions: number;

  @Column({ type: 'date' })
  deliveryDate: Date;
  
  @ManyToOne(() => Package,  packageEntity =>  packageEntity.products, { onDelete: 'CASCADE' }) 
  package: Package;
}
