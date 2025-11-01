import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerHttpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
