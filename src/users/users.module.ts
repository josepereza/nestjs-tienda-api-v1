import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { OrdersService } from 'src/orders/orders.service';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), OrdersModule],

  controllers: [UsersController],
  providers: [UsersService, OrdersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
