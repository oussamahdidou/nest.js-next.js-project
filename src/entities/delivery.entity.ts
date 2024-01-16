import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
  JoinColumn,
  OneToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Package } from './package.entity';
import { Warehouse } from './warehouse.entity';
import { AvailableDriver } from './availableDriver.entity';
import { IsEnum } from 'class-validator';
import { DeliveryStatus } from 'src/enumerations/delivery-status.enum';
import { EvaluationDelivery } from './evaluation-delivery.entity';

@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn()
  delivery_id: number;

  @OneToOne(
    () => AvailableDriver,
    (availableDriver) => availableDriver.delivery,
  )
  @JoinColumn()
  availableDriver: AvailableDriver;

  @OneToMany(() => Package, (packagee) => packagee.delivery)
  packages: Package[];

  @ManyToOne(() => Warehouse, { eager: true })
  startWarehouse: Warehouse;

  @ManyToOne(() => Warehouse, { eager: true })
  endWarehouse: Warehouse;

  @ManyToMany(() => Warehouse)
  @JoinTable()
  waypoints: Warehouse[];

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @IsEnum(DeliveryStatus)
  @Column({ default: DeliveryStatus.PENDING })
  status: DeliveryStatus;

  @OneToMany(
    () => EvaluationDelivery,
    (evaluationDelivery) => evaluationDelivery.delivery,
  )
  evaluations: EvaluationDelivery[];
}
