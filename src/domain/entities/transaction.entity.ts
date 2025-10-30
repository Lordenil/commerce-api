import { v4 as uuidv4 } from 'uuid';

export enum TransactionStatus {
  Pending = 'pending',
  Paid = 'paid',
  Failed = 'failed',
}

export class Transaction {
  constructor(
    public readonly id: string = uuidv4(),
    public customerId: string,
    public amountCents: number,
    public currency: string,
    public status: TransactionStatus,
    public paymentMethodId: string,
    public last4: string,
    public brand: string,
    public metadata: Record<string, any> = {},
    public createdAt: Date = new Date(),
  ) {}
}
