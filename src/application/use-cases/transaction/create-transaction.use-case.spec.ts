import {
  Transaction,
  TransactionStatus,
} from 'src/domain/entities/transaction.entity';
import { CreateTransactionUseCase } from './create-transaction.use-case';
import { TransactionRepositoryPort } from 'src/domain/ports/transaction.repository.port';
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';
import { CustomerRepositoryPort } from 'src/domain/ports/customer.repository.port';
import { WompiRepositoryPort } from 'src/domain/ports/wompi.repository.port';
import { Product } from 'src/domain/entities/product.entity';

const customer = { id: 'c1', name: 'John', email: 'john@mail.com' };
const product: Product = {
  id: 'p1',
  name: 'Laptop',
  sku: 'SKU-123',
  price: 1000,
  stock: 5,
  currency: 'COP',
  createdAt: new Date(),
};

const transaction: Transaction = {
  id: 't1',
  customerId: 'c1',
  productId: 'p1',
  amount: 1000,
  currency: 'COP',
  status: TransactionStatus.PENDING,
  paymentMethodId: 'CARD',
  last4: '4242',
  brand: 'VISA',
  metadata: {},
  createdAt: new Date(),
};

const input = {
  customerId: 'c1',
  productId: 'p1',
  amount: 1000,
  currency: 'COP',
  paymentMethod: {
    type: 'CARD',
    numberCard: '4242424242424242',
    expMonth: '12',
    expYear: '28',
    cvc: '123',
  },
  shippingData: {
    fullName: 'John',
    address: 'Cra 42',
    country: 'CO',
    city: 'Caldas',
    phoneNumber: '123456789',
    postalCode: '055440',
  },
};

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let transactionRepository: jest.Mocked<TransactionRepositoryPort>;
  let productRepository: jest.Mocked<ProductRepositoryPort>;
  let customerRepository: jest.Mocked<CustomerRepositoryPort>;
  let wompiRepository: jest.Mocked<WompiRepositoryPort>;

  beforeEach(() => {
    transactionRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
      findByWompiId: jest.fn(),
    };

    productRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      updateStock: jest.fn(),
    };

    customerRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    wompiRepository = {
      createTransaction: jest.fn(),
      getTransaction: jest.fn(),
      verifyWebhookSignature: jest.fn(),
    };

    useCase = new CreateTransactionUseCase(
      transactionRepository,
      productRepository,
      customerRepository,
      wompiRepository,
    );
  });

  it('should fail if customer not found', async () => {
    customerRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(input as any);

    expect(result.error!.message).toBe('Customer not found');
  });

  it('should fail if product not found', async () => {
    customerRepository.findById.mockResolvedValue(customer);
    productRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(input as any);

    expect(result.error!.message).toBe('Product not found');
  });

  it('should fail if product stock is 0', async () => {
    customerRepository.findById.mockResolvedValue(customer);
    productRepository.findById.mockResolvedValue({ ...product, stock: 0 });

    const result = await useCase.execute(input as any);

    expect(result.error!.message).toBe('Product out of stock');
  });

  it('should handle PENDING wompi response correctly', async () => {
    customerRepository.findById.mockResolvedValue(customer);
    productRepository.findById.mockResolvedValue(product);
    transactionRepository.save.mockResolvedValue(transaction);
    transactionRepository.updateStatus.mockResolvedValue({
      ...transaction,
      status: TransactionStatus.PENDING,
    });
    wompiRepository.createTransaction.mockResolvedValue({
      data: { id: 'w1', status: 'PENDING', reference: '' },
    });

    const result = await useCase.execute(input as any);

    expect(transactionRepository.save).toHaveBeenCalled();
    expect(transactionRepository.updateStatus).toHaveBeenCalledWith(
      't1',
      TransactionStatus.APPROVED,
      'w1',
    );
    expect(productRepository.updateStock).toHaveBeenCalledWith('p1', 4);
    expect(result.isSuccess).toBe(true);
  });

  it('should handle APPROVED wompi response correctly', async () => {
    customerRepository.findById.mockResolvedValue(customer);
    productRepository.findById.mockResolvedValue(product);
    transactionRepository.save.mockResolvedValue(transaction);
    transactionRepository.updateStatus.mockResolvedValue({
      ...transaction,
      status: TransactionStatus.APPROVED,
    });
    wompiRepository.createTransaction.mockResolvedValue({
      data: { id: 'w1', reference: '123', status: 'APPROVED' },
    });

    const result = await useCase.execute(input as any);

    expect(transactionRepository.updateStatus).toHaveBeenCalledWith(
      't1',
      TransactionStatus.APPROVED,
      'w1',
    );
    expect(productRepository.updateStock).toHaveBeenCalledWith('p1', 4);
    expect(result.isSuccess).toBe(true);
    expect(result.value!.status).toBe(TransactionStatus.APPROVED);
  });

  it('should handle DECLINED wompi response correctly', async () => {
    customerRepository.findById.mockResolvedValue(customer);
    productRepository.findById.mockResolvedValue(product);
    transactionRepository.save.mockResolvedValue(transaction);
    transactionRepository.updateStatus.mockResolvedValue({
      ...transaction,
      status: TransactionStatus.DECLINED,
    });
    wompiRepository.createTransaction.mockResolvedValue({
      data: {
        id: '123',
        reference: '123',
        status: 'DECLINED',
      },
    });

    const result = await useCase.execute(input as any);

    expect(transactionRepository.updateStatus).toHaveBeenCalledWith(
      't1',
      TransactionStatus.DECLINED,
    );
    expect(productRepository.updateStock).not.toHaveBeenCalled();
    expect(result.isSuccess).toBe(true);
    expect(result.value!.status).toBe(TransactionStatus.DECLINED);
  });

  it('should return failure when repository throws', async () => {
    customerRepository.findById.mockRejectedValue(new Error('DB Error'));

    const result = await useCase.execute(input as any);

    expect(result.error!.message).toBe('DB Error');
  });
});
