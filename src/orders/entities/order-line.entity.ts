// src/orders/entities/order-line.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';

@Entity('order_lines')
export class OrderLine {
  @PrimaryGeneratedColumn()
  id: number;

  // Cantidad del producto en el pedido
  @Column('int', { default: 1 })
  quantity: number;

  // Precio unitario (se copia del producto en el momento del pedido)
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  // Relación con el producto (N líneas pueden apuntar al mismo producto)
  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  // Relación con el pedido padre
  @ManyToOne(() => Order, (order) => order.lines, {
    onDelete: 'CASCADE',
  })
  order: Order;
}
