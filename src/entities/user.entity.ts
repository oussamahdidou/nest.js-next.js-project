import { RoleType } from '../enumerations/role.enum';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.ADMIN })
  role: RoleType;

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
