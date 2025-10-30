import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { OrdersService } from 'src/orders/orders.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  // 🧩 Crear nuevo usuario
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // 🔍 Obtener todos los usuarios (opcional, solo para administración)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // 🔍 Obtener un usuario por ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  // 🧾 Obtener un usuario con todos sus pedidos (y líneas)
  @UseGuards(JwtAuthGuard)
  @Get(':id/orders')
  async findUserWithOrders(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Lazy load de pedidos
    const orders = await user.orders;

    // Cargar líneas (lazy) para cada pedido
    const ordersWithLines = await Promise.all(
      orders.map(async (o) => ({
        ...o,
        lines: await this.ordersService.getLines(o),
      })),
    );

    return { ...user, orders: ordersWithLines };
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
