import { Controller, Post, Get, Body } from '@nestjs/common';
import { CreateProductUseCase } from 'src/application/use-cases/create-product.use-case';
import { ProductRepositoryAdapter } from 'src/infraestructure/repositories/product.repository.adapter';
import { CreateProductHttpDto } from './dto/create-product.http-dto';

@Controller('products')
export class ProductController {
  private readonly createProductUseCase: CreateProductUseCase;

  constructor(private readonly productRepository: ProductRepositoryAdapter) {
    this.createProductUseCase = new CreateProductUseCase(productRepository);
  }

  @Post()
  async create(@Body() body: CreateProductHttpDto) {
    const result = await this.createProductUseCase.execute(body);
    if (!result.isSuccess) throw result.error;
    return result.value;
  }

  @Get()
  async getAll() {
    return this.productRepository.findAll();
  }
}
