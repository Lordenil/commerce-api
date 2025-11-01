import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';
import { Result } from 'src/domain/result';
import { Injectable } from 'src/shared/dependency-injection/injectable';
import { FindProductByIdDto } from './dto/find-product-by-id.dto';
import { Product } from 'src/domain/entities/product.entity';

@Injectable()
export class FindProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  async execute(
    findProductById: FindProductByIdDto,
  ): Promise<Result<Product, Error>> {
    try {
      const product = await this.productRepository.findById(findProductById.id);
      if (product) {
        return Result.ok(product);
      } else {
        return Result.fail(new Error('Product not found'));
      }
    } catch (err: any) {
      return Result.fail(err);
    }
  }
}
