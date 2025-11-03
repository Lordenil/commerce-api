import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';
import { Product } from 'src/domain/entities/product.entity';
import { FindProductByIdUseCase } from './find-product-by-id.use-case';

describe('FindProductByIdUseCase', () => {
  let useCase: FindProductByIdUseCase;
  let productRepository: jest.Mocked<ProductRepositoryPort>;

  beforeEach(() => {
    productRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      updateStock: jest.fn(),
    };

    useCase = new FindProductByIdUseCase(productRepository);
  });

  it('should return product by id', async () => {
    const existing = new Product(
      'Portatil',
      '123',
      1000000,
      'unit',
      10,
      '123',
      new Date(),
    );
    productRepository.findById.mockResolvedValue(existing);

    const result = await useCase.execute({ id: '123' });

    expect(productRepository.findById).toHaveBeenCalledWith('123');
    expect(result.isSuccess).toBe(true);
    expect(result.value).toBe(existing);
  });

  it('should return fail if repository throws error', async () => {
    productRepository.findAll.mockRejectedValue(new Error('Product not found'));

    const result = await useCase.execute({ id: '123' });

    expect(result.error).toEqual(new Error('Product not found'));
  });
});
