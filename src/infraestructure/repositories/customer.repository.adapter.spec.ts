import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { CustomerRepositoryAdapter } from './customer.repository.adapter';
import { CustomerOrmEntity } from '../db/entities/customer.orm-entity';
import { MockType, RepositoryMock } from 'src/shared/types/repository.mock';

const mockCustomer: CustomerOrmEntity = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@mail.com',
  createdAt: new Date(),
};

describe('CustomerAdapter', () => {
  let adapter: CustomerRepositoryAdapter;
  let repositoryMock: MockType<Repository<CustomerOrmEntity>>;

  beforeEach(async () => {
    const { provider, token } = RepositoryMock(CustomerOrmEntity);

    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerRepositoryAdapter, provider],
    }).compile();

    adapter = module.get<CustomerRepositoryAdapter>(CustomerRepositoryAdapter);
    repositoryMock = module.get(token);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  it('should find a customer by email', async () => {
    repositoryMock.findOne!.mockReturnValue(Promise.resolve(mockCustomer));

    const result = await adapter.findByEmail('test@mail.com');

    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      where: { email: 'test@mail.com' },
    });
    expect(result).toEqual(mockCustomer);
  });

  it('should save a customer', async () => {
    repositoryMock.create!.mockReturnValue(mockCustomer);
    repositoryMock.save!.mockReturnValue(mockCustomer);

    const result = await adapter.save(mockCustomer);

    expect(repositoryMock.create).toHaveBeenCalledWith(mockCustomer);
    expect(repositoryMock.save).toHaveBeenCalledWith(mockCustomer);
    expect(result).toEqual(mockCustomer);
  });

  it('should find all customers', async () => {
    repositoryMock.find!.mockReturnValue([mockCustomer]);

    const result = await adapter.findAll();

    expect(repositoryMock.find).toHaveBeenCalled();
    expect(result).toEqual([mockCustomer]);
  });
});
