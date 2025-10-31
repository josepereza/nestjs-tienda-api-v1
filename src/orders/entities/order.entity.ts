import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderLine } from './order-line.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number;

  // Relación con usuario
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  // Relación con líneas del pedido
  @OneToMany(() => OrderLine, (line) => line.order)
  lines: OrderLine[];
}
