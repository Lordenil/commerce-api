import { v4 as uuidv4 } from 'uuid';

export enum DeliveryStatus {
  Pending = 'pending',
  InTransit = 'in_transit',
  Delivered = 'delivered',
}

export class Delivery {
  constructor(
    public readonly id: string = uuidv4(),
    public transactionId: string,
    public address: string,
    public status: DeliveryStatus,
    public eta: Date,
    public createdAt: Date = new Date(),
  ) {}
}
