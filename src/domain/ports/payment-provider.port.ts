export abstract class PaymentProviderPort {
  abstract charge(
    amountCents: number,
    currency: string,
    paymentMethodId: string,
    metadata?: Record<string, any>,
  ): Promise<{ status: string; transactionId: string }>;
}
