import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from 'src/infraestructure/db/entities/product.orm-entity';
import { ProductRepositoryAdapter } from 'src/infraestructure/repositories/product.repository.adapter';
import { ProductController } from './http-api/product/product.controller';
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';
import { CreateProductUseCase } from 'src/application/use-cases/product/create-product.use-case';
import { FindProductByIdUseCase } from 'src/application/use-cases/product/find-product-by-id.use-case';
import { FindProductAllUseCase } from 'src/application/use-cases/product/find-product-all.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  providers: [
    CreateProductUseCase,
    FindProductByIdUseCase,
    FindProductAllUseCase,
    ProductRepositoryAdapter,
    {
      provide: ProductRepositoryPort,
      useExisting: ProductRepositoryAdapter,
    },
  ],
  controllers: [ProductController],
  exports: [CreateProductUseCase, FindProductByIdUseCase],
})
export class ProductModule {}
