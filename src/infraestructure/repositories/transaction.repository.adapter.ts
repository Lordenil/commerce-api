import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepositoryPort } from 'src/domain/ports/transaction.repository.port';
import { Repository } from 'typeorm';
import { TransactionOrmEntity } from '../db/entities/transaction.orm-entity';
import {
  Transaction,
  TransactionStatus,
} from 'src/domain/entities/transaction.entity';

@Injectable()
export class TransactionRepositoryAdapter implements TransactionRepositoryPort {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly ormRepo: Repository<TransactionOrmEntity>,
  ) {}

  async save(transaction: Transaction): Promise<Transaction> {
    const entity = this.ormRepo.create(transaction);
    const saved = await this.ormRepo.save(entity);
    return saved;
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
  ): Promise<Transaction> {
    const transaction = await this.ormRepo.findOne({ where: { id } });
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    transaction.status = status;
    await this.ormRepo.save(transaction);
    return transaction;
  }

  async findByWompiId(wompiId: string): Promise<Transaction | null> {
    return await this.ormRepo.findOne({
      where: { wompiTransactionId: wompiId },
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    return await this.ormRepo.findOne({ where: { id } });
  }
}
