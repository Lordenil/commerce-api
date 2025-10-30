import { Product } from '../../domain/entities/product.entity';
import { Result } from '../../domain/result';
import { ProductRepositoryPort } from '../ports/inbound/product.repository.port';

export class CreateProductUseCase {
  constructor(private readonly productRepo: ProductRepositoryPort) {}

  async execute(input: {
    name: string;
    sku: string;
    priceCents: number;
    currency: string;
    stock: number;
  }): Promise<Result<Product, Error>> {
    try {
      const product = new Product(
        input.name,
        input.sku,
        input.priceCents,
        input.currency,
        input.stock,
      );

      const saved = await this.productRepo.save(product);
      return Result.ok(saved);
    } catch (err: any) {
      return Result.fail(err);
    }
  }
}
