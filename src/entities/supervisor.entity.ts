import { RoleType } from 'src/enumerations/role.enum';
import { User } from './user.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { EvaluationDelivery } from './evaluation-delivery.entity';

@Entity('supervisors')
export class Supervisor extends User {
  constructor() {
    super();
    this.role = RoleType.SUPERVISOR;
  }

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.supervisors)
  warehouse: Warehouse;

  @OneToMany(
    () => EvaluationDelivery,
    (evaluationDelivery) => evaluationDelivery.supervisor,
  )
  evaluations: EvaluationDelivery[];
}
