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
import { WompiTransactionRequestDto } from '../dto/wompi-transaction.dto';

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
        input.paymentMethod.type,
        input.paymentMethod.numberCard.slice(-4),
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

      const wompiRequest = this.buildWompiRequest(input, customer, saved.id!);

      const wompiResponse =
        await this.wompiRepository.createTransaction(wompiRequest);

      let updatedTransaction: Transaction;

      switch (wompiResponse.data.status) {
        case 'PENDING':
          saved.status = TransactionStatus.PENDING;
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
    transaction: CreateTransactionDto,
    customer: Customer,
    transactionId: string,
  ) {
    const wompiRequest: WompiTransactionRequestDto = {
      amountInCents: Math.round(transaction.amount * 100),
      customerEmail: customer.email,
      currency: transaction.currency,
      paymentMethod: {
        type: 'CARD',
        numberCard: transaction.paymentMethod.numberCard,
        expMonth: transaction.paymentMethod.expMonth,
        expYear: transaction.paymentMethod.expYear,
        cvc: transaction.paymentMethod.cvc,
        installments: 1,
      },
      reference: transactionId,
      shippingAddress: {
        name: transaction.shippingData.fullName,
        addressLine1: transaction.shippingData.address,
        country: transaction.shippingData.country,
        region: '',
        city: transaction.shippingData.city,
        phoneNumber: transaction.shippingData.phoneNumber,
        postalCode: transaction.shippingData.postalCode,
      },
    };
    return wompiRequest;
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
