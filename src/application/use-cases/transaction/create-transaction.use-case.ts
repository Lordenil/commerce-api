import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';
import { Result } from 'src/domain/result';
import { Injectable } from 'src/shared/dependency-injection/injectable';
import {
  Transaction,
  TransactionStatus,
} from 'src/domain/entities/transaction.entity';
import { TransactionRepositoryPort } from 'src/domain/ports/transaction.repository.port';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CustomerRepositoryPort } from 'src/domain/ports/customer.repository.port';
import { WompiRepositoryPort } from 'src/domain/ports/wompi.repository.port';
import { Customer } from 'src/domain/entities/customer.entity';
import { ResponseTransactionDto } from './dto/response-transaction.dto';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepositoryPort,
    private readonly productRepository: ProductRepositoryPort,
    private readonly customerRepository: CustomerRepositoryPort,
    private readonly wompiRepository: WompiRepositoryPort,
  ) {}

  async execute(
    input: CreateTransactionDto,
  ): Promise<Result<ResponseTransactionDto, Error>> {
    try {
      const customer = await this.customerRepository.findById(input.customerId);
      if (!customer) {
        return Result.fail(new Error('Customer not found'));
      }

      const product = await this.productRepository.findById(input.productId);
      if (!product) {
        return Result.fail(new Error('Product not found'));
      }

      if (product.stock < 1) {
        return Result.fail(new Error('Product out of stock'));
      }

      const transaction = new Transaction(
        input.customerId,
        input.productId,
        input.amount,
        input.currency,
        TransactionStatus.PENDING,
        input.paymentMethod.token,
        input.paymentMethod.token.slice(-4),
        'credit_card',
        undefined,
        {
          shippingData: input.shippingData,
          product: {
            name: product.name,
            sku: product.sku,
            price: product.price,
          },
          customer: {
            name: customer.name,
            email: customer.email,
          },
        },
      );

      const saved = await this.transactionRepository.save(transaction);

      const wompiRequest = this.buildWompiRequest(saved, customer, saved.id!);

      const wompiResponse =
        await this.wompiRepository.createTransaction(wompiRequest);

      let updatedTransaction: Transaction;

      switch (wompiResponse.data.status) {
        case 'APPROVED':
          saved.status = TransactionStatus.APPROVED;
          updatedTransaction = await this.transactionRepository.updateStatus(
            saved.id!,
            TransactionStatus.APPROVED,
            wompiResponse.data.id,
          );
          await this.productRepository.updateStock(
            product.id!,
            product.stock - 1,
          );
          break;

        case 'DECLINED':
          saved.status = TransactionStatus.DECLINED;
          updatedTransaction = await this.transactionRepository.updateStatus(
            saved.id!,
            TransactionStatus.DECLINED,
          );
          break;

        default:
          saved.status = TransactionStatus.ERROR;
          updatedTransaction = await this.transactionRepository.updateStatus(
            saved.id!,
            TransactionStatus.ERROR,
          );
      }

      return Result.ok(
        this.toTransactionResultDto(updatedTransaction, product, customer),
      );
    } catch (err: any) {
      return Result.fail(err);
    }
  }

  private buildWompiRequest(
    transaction: Transaction,
    customer: Customer,
    transactionId: string,
  ) {
    return {
      amount_in_cents: Math.round(transaction.amount * 100),
      currency: transaction.currency,
      customer_email: customer.email,
      payment_method: {
        type: 'credit_card',
        token: transaction.paymentMethodId,
        installments: 1,
      },
      reference: transactionId,
      shipping_address: {
        address_line_1: 'cra 123',
        country: 'Colombia',
        region: 'Antioquia',
        city: 'Caldas',
        name: customer.name,
        phone_number: '',
        postal_code: '',
      },
    };
  }

  private toTransactionResultDto(
    transaction: Transaction,
    product: any,
    customer: any,
  ): ResponseTransactionDto {
    return {
      transactionId: transaction.id!,
      wompiTransactionId: transaction.wompiTransactionId,
      status: transaction.status,
      amount: transaction.amount / 100,
      currency: transaction.currency,
      customerEmail: customer.email,
      productName: product.name,
      createdAt: transaction.createdAt!,
    };
  }
}
