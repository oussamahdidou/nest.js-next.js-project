import { RoleType } from 'src/enumerations/role.enum';
import { Entity, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity('owners')
export class Owner extends User {
  @Column()
  companyName: string;

  @Column()
  companyRegistrationNumber: string;

  @OneToMany(() => Product, (product) => product.owner)
  products: Product[];

  constructor() {
    super();
    this.role = RoleType.OWNER;
  }
}
