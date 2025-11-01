import { Product } from 'src/domain/entities/product.entity';

export abstract class ProductRepositoryPort {
  abstract save(product: Product): Promise<Product>;
  abstract updateStock(id: string, stock: number): Promise<Product>;
  abstract findAll(): Promise<Product[]>;
  abstract findById(id: string): Promise<Product | null>;
}
