import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { MockType, RepositoryMock } from 'src/shared/types/repository.mock';
import { ProductOrmEntity } from '../db/entities/product.orm-entity';
import { ProductRepositoryAdapter } from './product.repository.adapter';

const mockProduct: ProductOrmEntity = {
  id: '1',
  name: 'Product 1',
  currency: 'unit',
  sku: '1',
  price: 100000,
  stock: 50,
  createdAt: new Date(),
};

describe('ProductAdapter', () => {
  let adapter: ProductRepositoryAdapter;
  let repositoryMock: MockType<Repository<ProductOrmEntity>>;

  beforeEach(async () => {
    const { provider, token } = RepositoryMock(ProductOrmEntity);

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductRepositoryAdapter, provider],
    }).compile();

    adapter = module.get<ProductRepositoryAdapter>(ProductRepositoryAdapter);
    repositoryMock = module.get(token);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  it('should find all products', async () => {
    repositoryMock.find!.mockReturnValue([mockProduct]);

    const result = await adapter.findAll();

    expect(repositoryMock.find).toHaveBeenCalled();
    expect(result).toEqual([mockProduct]);
  });
});
