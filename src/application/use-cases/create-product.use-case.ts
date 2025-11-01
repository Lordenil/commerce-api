import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';
import { Product } from '../../domain/entities/product.entity';
import { Result } from '../../domain/result';
import { CreateProductDto } from './dto/create-product.dto';
import { Injectable } from 'src/shared/dependency-injection/injectable';

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  async execute(input: CreateProductDto): Promise<Result<Product, Error>> {
    try {
      const product = new Product(
        input.name,
        input.sku,
        input.priceCents,
        input.currency,
        input.stock,
      );

      const saved = await this.productRepository.save(product);
      return Result.ok(saved);
    } catch (err: any) {
      return Result.fail(err);
    }
  }
}
