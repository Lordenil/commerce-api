export class ResponseTransactionDto {
  transactionId: string;
  wompiTransactionId?: string;
  status: string;
  amount: number;
  currency: string;
  customerEmail: string;
  productName: string;
  createdAt: Date;
}
