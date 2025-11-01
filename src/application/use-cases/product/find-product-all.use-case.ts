import { Product } from 'src/domain/entities/product.entity';
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';
import { Result } from 'src/domain/result';
import { Injectable } from 'src/shared/dependency-injection/injectable';

@Injectable()
export class FindProductAllUseCase {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  async execute(): Promise<Result<Product[], Error>> {
    try {
      const products = await this.productRepository.findAll();

      if (products) {
        return Result.ok(products);
      } else {
        return Result.fail(new Error('Products not found'));
      }
    } catch (err: any) {
      return Result.fail(err);
    }
  }
}
