import { FindProductAllUseCase } from './find-product-all.use-case';
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';
import { Product } from 'src/domain/entities/product.entity';

describe('FindProductAllUseCase', () => {
  let useCase: FindProductAllUseCase;
  let productRepository: jest.Mocked<ProductRepositoryPort>;

  beforeEach(() => {
    productRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      updateStock: jest.fn(),
    };

    useCase = new FindProductAllUseCase(productRepository);
  });

  it('should return existing all products', async () => {
    const existing = [
      new Product('Portatil', '123', 1000000, 'unit', 10, '123', new Date()),
      new Product('Smartphone', '124', 800000, 'unit', 40, '124', new Date()),
    ];
    productRepository.findAll.mockResolvedValue(existing);

    const result = await useCase.execute();

    expect(productRepository.findAll).toHaveBeenCalled();
    expect(result.isSuccess).toBe(true);
    expect(result.value).toBe(existing);
  });

  it('should return fail if repository throws error', async () => {
    productRepository.findAll.mockRejectedValue(
      new Error('Customers not found'),
    );

    const result = await useCase.execute();

    expect(result.error).toEqual(new Error('Customers not found'));
  });
});
