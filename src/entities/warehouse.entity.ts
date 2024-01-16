import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Point,
} from 'typeorm';
import { AvailableDriver } from './availableDriver.entity';
import { Supervisor } from './supervisor.entity';

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column({ type: 'point' })
  location: Point;

  @OneToMany(
    () => AvailableDriver,
    (availableDriver) => availableDriver.startWarehouse,
  )
  startingDrivers: AvailableDriver[];

  @OneToMany(
    () => AvailableDriver,
    (availableDriver) => availableDriver.destination,
  )
  destinationDrivers: AvailableDriver[];

  @OneToMany(() => Supervisor, (supervisor) => supervisor.warehouse)
  supervisors: Supervisor[];
}
