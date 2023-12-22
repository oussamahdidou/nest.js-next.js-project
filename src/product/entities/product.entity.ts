import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Package } from 'src/entities/package.entity';
import { Warehouse } from 'src/entities/warehouse.entity';

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

  @ManyToOne(() => Warehouse, warehouse => warehouse.products)
  @JoinColumn({ name: 'warehouse_id' }) 
  
  warehouse: Warehouse;
  @ManyToOne(() => Package, (packageEntity) => packageEntity.products, {
    onDelete: 'CASCADE',
  })
  package: Package;
}
