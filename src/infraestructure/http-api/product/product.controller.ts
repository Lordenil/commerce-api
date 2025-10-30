import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CreateProductUseCase } from 'src/application/use-cases/create-product.use-case';
import { CreateProductHttpDto } from './dto/create-product.http-dto';
import { FindProductByIdUseCase } from 'src/application/use-cases/find-product-by-id.use-case';
import { FindProductByIdHttpDto } from './dto/find-product-by-id.http-dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly findProductByIdUseCase: FindProductByIdUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateProductHttpDto) {
    const result = await this.createProductUseCase.execute(body);
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
