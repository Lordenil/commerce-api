export class CreateTransactionDto {
  customerId: string;
  productId: string;
  amount: number;
  currency: string;
  paymentMethod: {
    type: string;
    numberCard: string;
    expYear: string;
    expMonth: string;
    cvc: string;
    installments: number;
  };
  shippingData: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    email: string;
  };
}
