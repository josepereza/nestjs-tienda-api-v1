import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password?: string; // hashed

  @Column({ nullable: true })
  name?: string;

  // relaciones (lazy) - cargar orders solo cuando se necesita
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
