import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { MockType, RepositoryMock } from 'src/shared/types/repository.mock';
import { TransactionOrmEntity } from '../db/entities/transaction.orm-entity';
import { TransactionStatus } from 'src/domain/entities/transaction.entity';
import { TransactionRepositoryAdapter } from './transaction.repository.adapter';

const mockTransaction: TransactionOrmEntity = {
  id: '1',
  customerId: '27b925c8-d50e-4e8c-b18c-ffa186035360',
  productId: '29fc382e-2a6c-4b86-937f-47e1db2e8c84',
  amount: 100000,
  currency: 'COP',
  brand: 'CARD',
  last4: '4242',
  paymentMethodId: 'prov_123',
  metadata: {},
  status: TransactionStatus.PENDING,
  wompiTransactionId: '123',
  createdAt: new Date(),
};

describe('TransactionAdapter', () => {
  let adapter: TransactionRepositoryAdapter;
  let repositoryMock: MockType<Repository<TransactionOrmEntity>>;

  beforeEach(async () => {
    const { provider, token } = RepositoryMock(TransactionOrmEntity);

    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionRepositoryAdapter, provider],
    }).compile();

    adapter = module.get<TransactionRepositoryAdapter>(
      TransactionRepositoryAdapter,
    );
    repositoryMock = module.get(token);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  it('should find transaction by id', async () => {
    repositoryMock.findOne!.mockReturnValue(Promise.resolve(mockTransaction));

    const result = await adapter.findById('1');

    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toEqual(mockTransaction);
  });
});
