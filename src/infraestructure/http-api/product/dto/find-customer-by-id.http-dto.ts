import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindCustomerByIdHttpDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
