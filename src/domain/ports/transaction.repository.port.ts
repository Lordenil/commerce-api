import { Transaction } from 'src/domain/entities/transaction.entity';

export abstract class TransactionRepositoryPort {
  abstract save(transaction: Transaction): Promise<Transaction>;
  abstract findAll(): Promise<Transaction[]>;
  abstract findById(id: string): Promise<Transaction | null>;
}
