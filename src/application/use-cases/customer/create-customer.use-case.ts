import { Injectable } from 'src/shared/dependency-injection/injectable';
import { CustomerRepositoryPort } from 'src/domain/ports/customer.repository.port';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from 'src/domain/entities/customer.entity';
import { Result } from 'src/domain/result';

@Injectable()
export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async execute(input: CreateCustomerDto): Promise<Result<Customer, Error>> {
    try {
      const existingCustomer = await this.customerRepository.findByEmail(
        input.email,
      );
      if (existingCustomer) {
        return Result.ok(existingCustomer);
      }

      const customer = new Customer(input.name, input.email);

      const saved = await this.customerRepository.save(customer);
      return Result.ok(saved);
    } catch (err: any) {
      return Result.fail(err);
    }
  }
}
