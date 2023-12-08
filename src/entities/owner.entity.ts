import { RoleType } from 'src/enumerations/role.enum';
import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('owners')
export class Owner extends User {
  @Column()
  companyName: string;

  @Column()
  companyRegistrationNumber: string;

  constructor() {
    super();
    this.role = RoleType.OWNER;
  }
}
