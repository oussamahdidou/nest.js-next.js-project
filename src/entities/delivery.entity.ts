// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   ManyToOne,
//   OneToMany,
//   Column,
// } from 'typeorm';
// import { Vehicle } from './vehicle.entity';
// import { Driver } from './driver.entity';
// import { Package } from './package.entity';
// import { Warehouse } from './warehouse.entity';

// @Entity('deliveries')
// export class Delivery {
//   @PrimaryGeneratedColumn()
//   delivery_id: number;

//   @ManyToOne(() => Vehicle, { eager: true })
//   vehicle: Vehicle;

//   @OneToMany(() => Package, (packagee) => packagee.delivery, { eager: true })
//   packages: Package[];

//   @ManyToOne(() => Warehouse, { eager: true })
//   startWarehouse: Warehouse;

//   @ManyToOne(() => Warehouse, { eager: true })
//   endWarehouse: Warehouse;

//   @Column({ type: 'datetime' })
//   startTime: Date;

//   @Column({ type: 'datetime' })
//   endTime: Date;
// }
