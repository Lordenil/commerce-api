import { CreateProductUseCase } from './create-product.use-case';
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';
import { Product } from 'src/domain/entities/product.entity';

const product: Product = {
  id: '123',
  name: 'Portatil',
  sku: '123',
  currency: 'unit',
  price: 1000000,
  stock: 50,
  createdAt: new Date(),
};

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let productRepository: jest.Mocked<ProductRepositoryPort>;

  beforeEach(() => {
    productRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      updateStock: jest.fn(),
    };

    useCase = new CreateProductUseCase(productRepository);
  });

  it('should return create product', async () => {
    productRepository.save.mockResolvedValue(product);

    const result = await useCase.execute({
      name: 'John Doe',
      sku: 'john@mail.com',
      currency: 'unit',
      price: 1000000,
      stock: 50,
    });

    expect(result.isSuccess).toBe(true);
    expect(result.value).toBe(product);
  });

  it('should return fail if repository throws error', async () => {
    productRepository.save.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute({
      name: 'John Doe',
      sku: 'john@mail.com',
      currency: 'unit',
      price: 1000000,
      stock: 50,
    });

    expect(result.error).toEqual(new Error('DB error'));
  });
});
