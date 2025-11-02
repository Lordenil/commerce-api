import { CustomerRepositoryPort } from 'src/domain/ports/customer.repository.port';
import { Customer } from 'src/domain/entities/customer.entity';
import { FindCustomerByIdUseCase } from './find-customer-by-id.use-case';

describe('FindCustomerByIdUseCase', () => {
  let useCase: FindCustomerByIdUseCase;
  let customerRepository: jest.Mocked<CustomerRepositoryPort>;

  beforeEach(() => {
    customerRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    useCase = new FindCustomerByIdUseCase(customerRepository);
  });

  it('should return existing all customers', async () => {
    const existing = new Customer('Jane Doe', 'jane@mail.com');

    customerRepository.findById.mockResolvedValue(existing);

    const result = await useCase.execute({ id: '1' });

    expect(customerRepository.findById).toHaveBeenCalled();
    expect(result.isSuccess).toBe(true);
    expect(result.value).toBe(existing);
  });

  it('should return fail if repository throws error', async () => {
    customerRepository.findById.mockRejectedValue(
      new Error('Customer not found'),
    );

    const result = await useCase.execute({ id: '1' });

    expect(result.error).toEqual(new Error('Customer not found'));
  });
});
