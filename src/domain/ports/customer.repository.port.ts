import { Customer } from 'src/domain/entities/customer.entity';

export abstract class CustomerRepositoryPort {
  abstract save(customer: Customer): Promise<Customer>;
  abstract findAll(): Promise<Customer[]>;
  abstract findById(id: string): Promise<Customer | null>;
}
