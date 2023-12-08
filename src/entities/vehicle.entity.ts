import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Driver } from './driver.entity';
import { AvailableDriver } from './availableDriver.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  vehicle_id: number;

  @Column()
  registrationNumber: string;

  @Column()
  marque: string;

  @Column()
  model: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Driver, (driver) => driver.vehicles)
  driver: Driver;

  @OneToOne(
    () => AvailableDriver,
    (availableDriver) => availableDriver.vehicle,
    { nullable: true, onDelete: 'CASCADE' },
  )
  availableDriver: AvailableDriver;
}
