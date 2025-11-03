import { CreateCustomerUseCase } from './create-customer.use-case';
import { CustomerRepositoryPort } from 'src/domain/ports/customer.repository.port';
import { Customer } from 'src/domain/entities/customer.entity';

describe('CreateCustomerUseCase', () => {
  let useCase: CreateCustomerUseCase;
  let customerRepository: jest.Mocked<CustomerRepositoryPort>;

  beforeEach(() => {
    customerRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    useCase = new CreateCustomerUseCase(customerRepository);
  });

  it('should return existing customer if email already exists', async () => {
    const existing = new Customer('John Doe', 'john@mail.com');
    customerRepository.findByEmail.mockResolvedValue(existing);

    const result = await useCase.execute({
      name: 'John Doe',
      email: 'john@mail.com',
    });

    expect(customerRepository.findByEmail).toHaveBeenCalledWith(
      'john@mail.com',
    );
    expect(customerRepository.save).not.toHaveBeenCalled();
    expect(result.isSuccess).toBe(true);
    expect(result.value).toBe(existing);
  });

  it('should create and save new customer if not exists', async () => {
    customerRepository.findByEmail.mockResolvedValue(null);
    const saved = new Customer('Jane Doe', 'jane@mail.com');
    customerRepository.save.mockResolvedValue(saved);

    const result = await useCase.execute({
      name: 'Jane Doe',
      email: 'jane@mail.com',
    });

    expect(customerRepository.findByEmail).toHaveBeenCalledWith(
      'jane@mail.com',
    );
    expect(customerRepository.save).toHaveBeenCalled();
    expect(result.isSuccess).toBe(true);
    expect(result.value).toEqual(saved);
  });

  it('should return fail if repository throws error', async () => {
    customerRepository.findByEmail.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute({
      name: 'John Doe',
      email: 'john@mail.com',
    });

    expect(result.error).toEqual(new Error('DB error'));
  });
});
