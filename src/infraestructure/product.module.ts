import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateProductUseCase } from 'src/application/use-cases/create-product.use-case';
import { ProductOrmEntity } from 'src/infraestructure/db/entities/product.orm-entity';
import { ProductRepositoryAdapter } from 'src/infraestructure/repositories/product.repository.adapter';
import { ProductController } from './http-api/product/product.controller';
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  providers: [
    CreateProductUseCase,
    ProductRepositoryAdapter,
    {
      provide: ProductRepositoryPort,
      useExisting: ProductRepositoryAdapter,
    },
  ],
  controllers: [ProductController],
  exports: [CreateProductUseCase],
})
export class ProductModule {}
