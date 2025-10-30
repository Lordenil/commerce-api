import { Transaction } from 'src/domain/entities/transaction.entity';

export interface TransactionRepositoryPort {
  save(transaction: Transaction): Promise<Transaction>;
  findAll(): Promise<Transaction[]>;
  findById(id: string): Promise<Transaction | null>;
}
