import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductOrmEntity } from '../db/entities/product.orm-entity';
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';
import { Product } from 'src/domain/entities/product.entity';

@Injectable()
export class ProductRepositoryAdapter implements ProductRepositoryPort {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly ormRepo: Repository<ProductOrmEntity>,
  ) {}

  async save(product: Product): Promise<Product> {
    const entity = this.ormRepo.create(product);
    const saved = await this.ormRepo.save(entity);
    return saved;
  }

  async findAll(): Promise<Product[]> {
    return await this.ormRepo.find();
  }

  async findById(id: string): Promise<Product | null> {
    return await this.ormRepo.findOne({ where: { id } });
  }
}
