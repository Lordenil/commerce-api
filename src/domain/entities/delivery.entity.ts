export enum DeliveryStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export class Delivery {
  constructor(
    public id: string,
    public transactionId: string,
    public address: string,
    public status: DeliveryStatus,
    public eta: Date,
    public createdAt: Date = new Date(),
  ) {}
}
