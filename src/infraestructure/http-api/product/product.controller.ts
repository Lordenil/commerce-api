import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CreateProductHttpDto } from './dto/create-product.http-dto';
import { FindProductByIdHttpDto } from './dto/find-product-by-id.http-dto';
import { CreateProductUseCase } from 'src/application/use-cases/product/create-product.use-case';
import { FindProductByIdUseCase } from 'src/application/use-cases/product/find-product-by-id.use-case';
import { FindProductAllUseCase } from 'src/application/use-cases/product/find-product-all.use-case';

@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly findProductByIdUseCase: FindProductByIdUseCase,
    private readonly findProductAllUseCase: FindProductAllUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateProductHttpDto) {
    const result = await this.createProductUseCase.execute(body);
    if (!result.isSuccess) throw result.error;
    return result.value;
  }

  @Get()
  async getAll() {
    const result = await this.findProductAllUseCase.execute();
    if (!result.isSuccess) throw result.error;
    return result.value;
  }

  @Get(':id')
  async getById(@Param() params: FindProductByIdHttpDto) {
    const result = await this.findProductByIdUseCase.execute(params);
    if (!result.isSuccess) throw result.error;
    return result.value;
  }
}
