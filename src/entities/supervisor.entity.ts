import { RoleType } from 'src/enumerations/role.enum';
import { User } from './user.entity';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Warehouse } from './warehouse.entity';

@Entity('supervisors')
export class Supervisor extends User {
  constructor() {
    super();
    this.role = RoleType.SUPERVISOR;
  }

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.supervisors)
  warehouse: Warehouse;
}
