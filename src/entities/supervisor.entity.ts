import { RoleType } from 'src/enumerations/role.enum';
import { User } from './user.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { EvaluationDelivery } from './evaluation-delivery.entity';
import { Package } from './package.entity';

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
    {
      cascade: true,
    },
  )
  evaluations: EvaluationDelivery[];

  @OneToMany(() => Package, (packag) => packag.creator)
  packages: Package[];
}
