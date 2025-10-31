export class CreateTransactionDto {
  customerId: string;
  productId: string;
  amountCents: number;
  currency: string;
  paymentMethod: {
    type: string;
    token: string;
    installments: number;
  };
  shippingData: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
}
