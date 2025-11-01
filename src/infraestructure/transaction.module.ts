import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionOrmEntity } from './db/entities/transaction.orm-entity';
import { TransactionRepositoryPort } from 'src/domain/ports/transaction.repository.port';
import { TransactionRepositoryAdapter } from './repositories/transaction.repository.adapter';
import { TransactionController } from './http-api/product/transaction.controller';
import { CreateTransactionUseCase } from 'src/application/use-cases/transaction/create-transaction.use-case';
import { WompiRepositoryPort } from 'src/domain/ports/wompi.repository.port';
import { WompiRepositoryAdapter } from './external/wompi.repository.adapter';
import { ProductRepositoryAdapter } from './repositories/product.repository.adapter';
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';
import { CustomerRepositoryPort } from 'src/domain/ports/customer.repository.port';
import { CustomerRepositoryAdapter } from './repositories/customer.repository.adapter';
import { ProductOrmEntity } from './db/entities/product.orm-entity';
import { CustomerOrmEntity } from './db/entities/customer.orm-entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      TransactionOrmEntity,
      ProductOrmEntity,
      CustomerOrmEntity,
    ]),
  ],
  providers: [
    CreateTransactionUseCase,
    TransactionRepositoryAdapter,
    {
      provide: TransactionRepositoryPort,
      useExisting: TransactionRepositoryAdapter,
    },
    {
      provide: ProductRepositoryPort,
      useClass: ProductRepositoryAdapter,
    },
    {
      provide: CustomerRepositoryPort,
      useClass: CustomerRepositoryAdapter,
    },
    {
      provide: WompiRepositoryPort,
      useClass: WompiRepositoryAdapter,
    },
  ],
  controllers: [TransactionController],
  exports: [CreateTransactionUseCase],
})
export class TransactionModule {}
