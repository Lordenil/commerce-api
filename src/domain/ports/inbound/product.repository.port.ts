import { Product } from 'src/domain/entities/product.entity';

export interface ProductRepositoryPort {
  save(product: Product): Promise<Product>;
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
}
