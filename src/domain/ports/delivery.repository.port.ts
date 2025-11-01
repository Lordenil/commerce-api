import { Delivery, DeliveryStatus } from 'src/domain/entities/delivery.entity';

export abstract class DeliveryRepositoryPort {
  abstract save(delivery: Delivery): Promise<Delivery>;
  abstract findByTransactionId(transactionId: string): Promise<Delivery | null>;
  abstract updateStatus(
    id: string,
    status: DeliveryStatus,
    eta?: Date,
  ): Promise<Delivery>;
}
