import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindProductByIdHttpDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
