import { Delivery } from 'src/domain/entities/delivery.entity';

export abstract class DeliveryRepositoryPort {
  abstract save(delivery: Delivery): Promise<Delivery>;
  abstract findAll(): Promise<Delivery[]>;
  abstract findById(id: string): Promise<Delivery | null>;
}
