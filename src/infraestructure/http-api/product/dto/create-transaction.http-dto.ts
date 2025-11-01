import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionHttpDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 0 })
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  numberCard: string;

  @IsString()
  @IsNotEmpty()
  expYear: string;

  @IsString()
  @IsNotEmpty()
  expMonth: string;

  @IsString()
  @IsNotEmpty()
  cvc: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 0 })
  installments: number;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
