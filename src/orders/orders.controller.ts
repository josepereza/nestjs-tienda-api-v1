import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 🧾 Crear un nuevo pedido
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() dto: CreateOrderDto,
    @Request() req: Request & { user: User },
  ) {
    return this.ordersService.create(dto, req.user);
  }

  // 📋 Listar todos los pedidos (admin)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: Request & { user: User }) {
    console.log('Mi usuario es :', req.user);
    return this.ordersService.findAll();
  }

  // 🔍 Obtener pedido con sus líneas
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOne(+id);
    const lines = await this.ordersService.getLines(order);
    return { ...order, lines };
  }
}
