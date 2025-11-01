import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateCustomerHttpDto } from './dto/create-customer.http-dto';
import { FindCustomerByIdHttpDto } from './dto/find-customer-by-id.http-dto';
import { CreateCustomerUseCase } from 'src/application/use-cases/customer/create-customer.use-case';
import { FindCustomerByIdUseCase } from 'src/application/use-cases/customer/find-customer-by-id.use-case';
import { FindCustomerAllUseCase } from 'src/application/use-cases/customer/find-customer-all.use-case';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly findCustomerByIdUseCase: FindCustomerByIdUseCase,
    private readonly findCustomerAllUseCase: FindCustomerAllUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateCustomerHttpDto) {
    const result = await this.createCustomerUseCase.execute(body);
    if (!result.isSuccess) throw result.error;
    return result.value;
  }

  @Get(':id')
  async getById(@Param() params: FindCustomerByIdHttpDto) {
    const result = await this.findCustomerByIdUseCase.execute(params);
    if (!result.isSuccess) throw result.error;
    return result.value;
  }

  @Get()
  async getAll() {
    const result = await this.findCustomerAllUseCase.execute();
    if (!result.isSuccess) throw result.error;
    return result.value;
  }
}
