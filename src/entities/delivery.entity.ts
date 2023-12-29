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
import { IsNotEmpty, IsEnum } from 'class-validator';
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

  @OneToMany(() => Package, (packagee) => packagee.delivery, { eager: true })
  packages: Package[];

  @ManyToOne(() => Warehouse, { eager: true })
  startWarehouse: Warehouse;

  @ManyToOne(() => Warehouse, { eager: true })
  endWarehouse: Warehouse;

  @ManyToMany(() => Warehouse)
  @JoinTable()
  waypoints: Warehouse[];

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'datetime' })
  endTime: Date;

  @IsNotEmpty()
  @IsEnum(DeliveryStatus)
  status: DeliveryStatus;

  @OneToMany(
    () => EvaluationDelivery,
    (evaluationDelivery) => evaluationDelivery.delivery,
  )
  evaluations: EvaluationDelivery[];
}
