import { Customer } from 'src/domain/entities/customer.entity';

export interface CustomerRepositoryPort {
  save(customer: Customer): Promise<Customer>;
  findAll(): Promise<Customer[]>;
  findById(id: string): Promise<Customer | null>;
}
