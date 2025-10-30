import { IsNumber, IsString } from 'class-validator';

export class CreateProductHttpDto {
  @IsString()
  name: string;

  @IsString()
  sku: string;

  @IsNumber()
  priceCents: number;

  @IsString()
  currency: string;

  @IsNumber()
  stock: number;
}
