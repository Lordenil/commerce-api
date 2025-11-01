import {
  WompiTransactionRequestDto,
  WompiTransactionResponseDto,
} from 'src/application/use-cases/dto/wompi-transaction.dto';

export abstract class WompiRepositoryPort {
  abstract createTransaction(
    request: WompiTransactionRequestDto,
  ): Promise<WompiTransactionResponseDto>;
  abstract getTransaction(transactionId: string): Promise<any>;
  abstract verifyWebhookSignature(
    reference: string,
    signature: string,
  ): Promise<boolean>;
}
