import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';
import { Product } from '../../domain/entities/product.entity';
import { Result } from '../../domain/result';
import { Injectable } from 'src/shared/dependency-injection/injectable';
import { FindProductByIdDto } from './dto/find-product-by-id.dto';

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
