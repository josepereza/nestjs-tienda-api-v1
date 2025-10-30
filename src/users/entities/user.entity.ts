import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string; // hashed

  @Column({ nullable: true })
  name?: string;

  // relaciones (lazy) - cargar orders solo cuando se necesita
  @OneToMany(() => Order, (order) => order.user, { lazy: true })
  orders: Promise<Order[]>;
}
