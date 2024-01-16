import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Package } from 'src/entities/package.entity';
import { Owner, Warehouse } from 'src/entities';
import { ProductStatus } from 'src/enumerations/product-status.enum';

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

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.InStock,
  })
  status: ProductStatus;

  @ManyToOne(() => Owner, (owner) => owner.products)
  owner: Owner;

  @ManyToOne(() => Warehouse)
  startWarehouse: Warehouse;

  @ManyToOne(() => Warehouse)
  destination: Warehouse;

  @ManyToOne(() => Package, (packageEntity) => packageEntity.products, {
    onDelete: 'CASCADE',
  })
  package: Package;
}
