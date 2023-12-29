import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Delivery } from './delivery.entity';
import { Supervisor } from './supervisor.entity';
import { PackageEtat } from 'src/enumerations/package-etat.enum';

@Entity()
export class EvaluationDelivery {
  @PrimaryGeneratedColumn()
  evaluation_id: number;

  @Column({ nullable: true })
  delay: number;

  @Column()
  packageEtat: PackageEtat;

  @Column()
  score: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @ManyToOne(() => Delivery, (delivery) => delivery.evaluations)
  @JoinColumn({ name: 'delivery_id' })
  delivery: Delivery;

  @ManyToOne(() => Supervisor, (supervisor) => supervisor.evaluations)
  @JoinColumn({ name: 'supervisor_id' })
  supervisor: Supervisor;
}
