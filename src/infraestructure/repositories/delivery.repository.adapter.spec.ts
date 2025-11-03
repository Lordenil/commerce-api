import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { MockType, RepositoryMock } from 'src/shared/types/repository.mock';
import { DeliveryOrmEntity } from '../db/entities/delivery.orm-entity';
import { DeliveryStatus } from 'src/domain/entities/delivery.entity';
import { DeliveryRepositoryAdapter } from './delivery.repository.adapter';

const mockDelivery: DeliveryOrmEntity = {
  id: '1',
  address: 'Cra 52',
  eta: new Date(),
  status: DeliveryStatus.PENDING,
  transactionId: '123',
  createdAt: new Date(),
};

describe('DeliveryAdapter', () => {
  let adapter: DeliveryRepositoryAdapter;
  let repositoryMock: MockType<Repository<DeliveryOrmEntity>>;

  beforeEach(async () => {
    const { provider, token } = RepositoryMock(DeliveryOrmEntity);

    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryRepositoryAdapter, provider],
    }).compile();

    adapter = module.get<DeliveryRepositoryAdapter>(DeliveryRepositoryAdapter);
    repositoryMock = module.get(token);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  it('should find all deliveries', async () => {
    repositoryMock.find!.mockReturnValue([mockDelivery]);

    const result = await adapter.findAll();

    expect(repositoryMock.find).toHaveBeenCalled();
    expect(result).toEqual([mockDelivery]);
  });
});
