import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepositoryPort } from 'src/domain/ports/customer.repository.port';
import { CustomerRepositoryAdapter } from './repositories/customer.repository.adapter';
import { CustomerController } from './http-api/product/customer.controller';
import { CustomerOrmEntity } from './db/entities/customer.orm-entity';
import { CreateCustomerUseCase } from 'src/application/use-cases/customer/create-customer.use-case';
import { FindCustomerByIdUseCase } from 'src/application/use-cases/customer/find-customer-by-id.use-case';
import { FindCustomerAllUseCase } from 'src/application/use-cases/customer/find-customer-all.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerOrmEntity])],
  providers: [
    CreateCustomerUseCase,
    FindCustomerByIdUseCase,
    FindCustomerAllUseCase,
    CustomerRepositoryAdapter,
    {
      provide: CustomerRepositoryPort,
      useExisting: CustomerRepositoryAdapter,
    },
  ],
  controllers: [CustomerController],
  exports: [CreateCustomerUseCase],
})
export class CustomerModule {}
