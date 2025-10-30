import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderLine } from './entities/order-line.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderLine)
    private readonly lineRepo: Repository<OrderLine>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    const { lines } = createOrderDto;

    // Crear pedido vacío
    const order = this.orderRepo.create({ user, total: 0 });
    await this.orderRepo.save(order);

    let total = 0;

    for (const line of lines) {
      const product = await this.productRepo.findOne({
        where: { id: line.productId },
      });
      if (!product)
        throw new NotFoundException(`Producto ${line.productId} no encontrado`);

      const orderLine = this.lineRepo.create({
        product,
        quantity: line.quantity,
        price: product.price,
        order,
      });

      total += Number(product.price) * line.quantity;
      await this.lineRepo.save(orderLine);
    }

    order.total = total;
    return this.orderRepo.save(order);
  }

  async findAll() {
    return this.orderRepo.find();
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Pedido no encontrado');
    return order;
  }

  // Cargar líneas (lazy)
  async getLines(order: Order) {
    return await order.lines;
  }
}
