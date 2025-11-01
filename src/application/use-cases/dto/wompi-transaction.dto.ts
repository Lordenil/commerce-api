export class WompiTransactionRequestDto {
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  payment_method: {
    type: string;
    token: string;
    installments: number;
  };
  reference: string;
  shipping_address: {
    address_line_1: string;
    address_line_2?: string;
    country: string;
    region: string;
    city: string;
    name: string;
    phone_number: string;
    postal_code: string;
  };
}

export class WompiTransactionResponseDto {
  data: {
    id: string;
    status: 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR';
    reference: string;
  };
}
