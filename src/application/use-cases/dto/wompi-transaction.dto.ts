export class WompiTransactionRequestDto {
  amountInCents: number;
  currency: string;
  customerEmail: string;
  paymentMethod: {
    type: string;
    installments: number;
    numberCard: string;
    expMonth: string;
    expYear: string;
    cvc: string;
  };
  taxes: {
    type: string;
    amount_in_cents: number;
  };
  reference: string;
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    country: string;
    region: string;
    city: string;
    name: string;
    phoneNumber: string;
    postalCode: string;
  };
}

export class WompiTransactionResponseDto {
  data: {
    id: string;
    status: 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR' | 'PENDING';
    reference: string;
  };
}
