import { RoleType } from '../enumerations/role.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.SUPERVISOR })
  role: RoleType;

  // other information about the user

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  CNI: string;

  @Column({ type: 'date', nullable: true })
  dateBirth: Date;

  @Column()
  phoneNumber: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
