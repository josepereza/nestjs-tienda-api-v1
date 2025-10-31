import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepo: Repository<Product>,
    @InjectRepository(ProductImage)
    private imagesRepo: Repository<ProductImage>,
  ) {}

  create(dto: CreateProductDto) {
    console.log(dto)
    const p = this.productsRepo.create(dto);
    return this.productsRepo.save(p);
  }

  findAll() {
    return this.productsRepo.find(); // images vienen por eager
  }

  findOne(id: number) {
    return this.productsRepo.findOne({ where: { id } });
  }

  async addImage(productId: number, filePath: string) {
    const product = await this.findOne(productId);
    if (!product) throw new NotFoundException('Product not found');
    const img = this.imagesRepo.create({ path: filePath, product });
    return this.imagesRepo.save(img);
  }

  async removeImage(id: number) {
    return this.imagesRepo.delete(id);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
