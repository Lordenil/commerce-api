import {
  Transaction,
  TransactionStatus,
} from 'src/domain/entities/transaction.entity';

export abstract class TransactionRepositoryPort {
  abstract save(transaction: Transaction): Promise<Transaction>;
  abstract findById(id: string): Promise<Transaction | null>;
  abstract updateStatus(
    id: string,
    status: TransactionStatus,
  ): Promise<Transaction>;
  abstract findByWompiId(wompiId: string): Promise<Transaction | null>;
}
