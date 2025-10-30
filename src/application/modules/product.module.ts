import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from 'src/infraestructure/db/entities/product.orm-entity';
import { ProductController } from '../controllers/product.controller';
import { ProductRepositoryAdapter } from 'src/infraestructure/db/repositories/product.repository.adapter';
import { CreateProductUseCase } from 'src/domain/use-cases/create-product.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  controllers: [ProductController],
  providers: [ProductRepositoryAdapter, CreateProductUseCase],
  exports: [ProductRepositoryAdapter],
})
export class ProductModule {}
