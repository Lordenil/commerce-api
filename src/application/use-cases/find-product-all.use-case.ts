import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';
import { Product } from '../../domain/entities/product.entity';
import { Result } from '../../domain/result';
import { Injectable } from 'src/shared/dependency-injection/injectable';

@Injectable()
export class FindProductAllUseCase {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  async execute(): Promise<Result<Product[], Error>> {
    let products: Product[] | null;
    try {
      products = await this.productRepository.findAll();
    } catch (err: any) {
      return Result.fail(err);
    }

    if (products) {
      return Result.ok(products);
    } else {
      return Result.fail(new Error('Products not found'));
    }
  }
}
