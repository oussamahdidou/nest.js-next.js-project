import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { Warehouse } from './warehouse.entity';
import { Delivery } from './delivery.entity';

@Entity('available_drivers')
export class AvailableDriver {
  @PrimaryGeneratedColumn()
  available_driver_id: number;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.availableDrivers)
  @JoinColumn()
  vehicle: Vehicle;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  availableVolume: number;

  @Column()
  availableWeight: number;

  @Column({ default: false })
  archived: boolean;

  @ManyToOne(() => Warehouse)
  startWarehouse: Warehouse;

  @ManyToOne(() => Warehouse)
  destination: Warehouse;

  @ManyToMany(() => Warehouse)
  @JoinTable()
  waypoints: Warehouse[];

  @OneToOne(() => Delivery, (delivery) => delivery.availableDriver, {
    nullable: true,
  })
  delivery: Delivery;
}
