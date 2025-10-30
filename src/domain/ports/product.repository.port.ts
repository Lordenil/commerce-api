import { Product } from 'src/domain/entities/product.entity';

export abstract class ProductRepositoryPort {
  abstract save(product: Product): Promise<Product>;
  abstract findAll(): Promise<Product[]>;
  abstract findById(id: string): Promise<Product | null>;
}
