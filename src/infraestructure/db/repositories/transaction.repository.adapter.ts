import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepositoryPort } from 'src/domain/ports/inbound/transaction.repository.port';
import { Repository } from 'typeorm';
import { TransactionOrmEntity } from '../entities/transaction.orm-entity';
import { Transaction } from 'src/domain/entities/transaction.entity';

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

  async findAll(): Promise<Transaction[]> {
    return await this.ormRepo.find();
  }

  async findById(id: string): Promise<Transaction | null> {
    return await this.ormRepo.findOne({ where: { id } });
  }
}
