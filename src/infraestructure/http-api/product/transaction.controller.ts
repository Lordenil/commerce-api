import { Controller, Post, Body } from '@nestjs/common';
import { CreateTransactionUseCase } from 'src/application/use-cases/transaction/create-transaction.use-case';
import { CreateTransactionHttpDto } from './dto/create-transaction.http-dto';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateTransactionHttpDto) {
    const result = await this.createTransactionUseCase.execute({
      customerId: body.customerId,
      productId: body.productId,
      amount: body.amount,
      currency: body.currency,
      paymentMethod: {
        type: body.type,
        token: body.token,
        installments: body.installments,
      },
      shippingData: {
        fullName: body.fullName,
        address: body.address,
        city: body.city,
        postalCode: body.postalCode,
        country: body.country,
        phone: body.phone,
        email: body.email,
      },
    });
    if (!result.isSuccess) throw result.error;
    return result.value;
  }
}
