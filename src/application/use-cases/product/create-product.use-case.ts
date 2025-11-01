import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';
import { Result } from 'src/domain/result';
import { CreateProductDto } from './dto/create-product.dto';
import { Injectable } from 'src/shared/dependency-injection/injectable';
import { Product } from 'src/domain/entities/product.entity';

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  async execute(input: CreateProductDto): Promise<Result<Product, Error>> {
    try {
      const product = new Product(
        input.name,
        input.sku,
        input.price,
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
