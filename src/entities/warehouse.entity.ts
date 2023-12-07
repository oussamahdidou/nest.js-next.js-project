
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('warehouse')
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  location: string;
  
 // @OneToMany(() => Product, product => product.warehouse)
  //products: Product;
}
