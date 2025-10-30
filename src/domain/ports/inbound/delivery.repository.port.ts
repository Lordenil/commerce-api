import { Delivery } from 'src/domain/entities/delivery.entity';

export interface DeliveryRepositoryPort {
  save(delivery: Delivery): Promise<Delivery>;
  findAll(): Promise<Delivery[]>;
  findById(id: string): Promise<Delivery | null>;
}
