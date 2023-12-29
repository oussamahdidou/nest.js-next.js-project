import { RoleType } from 'src/enumerations/role.enum';
import { Entity, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Vehicle } from './vehicle.entity';

@Entity('drivers')
export class Driver extends User {
  @Column()
  drivingLicence: string;

  @Column()
  permitPoints: number;

  @Column({ default: 0 })
  score: number;

  @Column({ default: 0 })
  penalty: number;

  constructor() {
    super();
    this.role = RoleType.DRIVER;
  }

  @OneToMany(() => Vehicle, (vehicle) => vehicle.driver, {
    cascade: true,
  })
  vehicles: Vehicle[];
}
