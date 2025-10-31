import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderLine } from './entities/order-line.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order-line.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderLine)
    private readonly orderLineRepository: Repository<OrderLine>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, user: User) {
    // Crear la orden base
    console.log('en ordeService', user);
    const order = this.orderRepository.create({ user, total: 0 });
    const savedOrder = await this.orderRepository.save(order);

    // Crear las líneas
    let total = 0;
    for (const lineDto of createOrderDto.lines) {
      const product = await this.productRepository.findOne({
        where: { id: lineDto.productId },
      });
      if (!product)
        throw new NotFoundException(
          `Producto ${lineDto.productId} no encontrado`,
        );

      const line = this.orderLineRepository.create({
        order: savedOrder,
        product,
        quantity: lineDto.quantity,
        price: product.price,
      });

      total += line.price * line.quantity;
      await this.orderLineRepository.save(line);
    }

    // Actualizar total explícitamente
    await this.orderRepository.update(savedOrder.id, { total });

    // Devolver orden completa con líneas
    return this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['user', 'lines', 'lines.product'],
    });
  }

  async findAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['lines', 'lines.product', 'user'],
      order: { createdAt: 'DESC' }, // opcional: para ordenar por fecha
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({ where: { id },
      relations: ['lines', 'lines.product', 'user'],
      order: { createdAt: 'DESC' }, // opcional: para ordenar por fecha});
    });
    if (!order) throw new NotFoundException('Pedido no encontrado');
    return order;
  }

  // Cargar líneas (lazy)
  async getLines(order: Order) {
    return order.lines;
  }
}
