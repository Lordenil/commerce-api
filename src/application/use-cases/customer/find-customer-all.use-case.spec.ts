import { CustomerRepositoryPort } from 'src/domain/ports/customer.repository.port';
import { Customer } from 'src/domain/entities/customer.entity';
import { FindCustomerAllUseCase } from './find-customer-all.use-case';

describe('FindCustomerAllUseCase', () => {
  let useCase: FindCustomerAllUseCase;
  let customerRepository: jest.Mocked<CustomerRepositoryPort>;

  beforeEach(() => {
    customerRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    useCase = new FindCustomerAllUseCase(customerRepository);
  });

  it('should return existing all customers', async () => {
    const existing = [
      new Customer('John Doe', 'john@mail.com'),
      new Customer('Jane Doe', 'jane@mail.com'),
    ];
    customerRepository.findAll.mockResolvedValue(existing);

    const result = await useCase.execute();

    expect(customerRepository.findAll).toHaveBeenCalled();
    expect(result.isSuccess).toBe(true);
    expect(result.value).toBe(existing);
  });

  it('should return fail if repository throws error', async () => {
    customerRepository.findByEmail.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute();

    expect(result.error).toEqual(new Error('Customers not found'));
  });
});
