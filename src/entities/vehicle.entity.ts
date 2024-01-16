import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
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
  licensePlate: string;

  @Column()
  marque: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Driver, (driver) => driver.vehicles)
  @JoinColumn()
  driver: Driver;

  @OneToMany(
    () => AvailableDriver,
    (availableDriver) => availableDriver.vehicle,
  )
  availableDrivers: AvailableDriver[];
}
