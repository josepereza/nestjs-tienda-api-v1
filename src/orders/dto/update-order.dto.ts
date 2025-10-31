import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order-line.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
