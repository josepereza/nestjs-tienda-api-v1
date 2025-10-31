import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { CreateOrderLineDto } from './create-order-line.dto';

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderLineDto)
  lines: CreateOrderLineDto[];

  @IsOptional()
  @IsInt()
  userId?: number; // opcional, normalmente se obtiene del token JWT
}
