export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined',
  ERROR = 'error',
}

export class Transaction {
  constructor(
    public customerId: string,
    public productId: string,
    public amount: number,
    public currency: string,
    public status: TransactionStatus,
    public paymentMethodId: string,
    public last4: string,
    public brand: string,
    public wompiTransactionId?: string,
    public metadata: Record<string, any> = {},
    public id?: string,
    public createdAt?: Date,
  ) {}
}
