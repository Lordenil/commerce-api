import { Customer } from 'src/domain/entities/customer.entity';
import { Injectable } from 'src/shared/dependency-injection/injectable';
import { CustomerRepositoryPort } from 'src/domain/ports/customer.repository.port';
import { Result } from 'src/domain/result';

@Injectable()
export class FindCustomerAllUseCase {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async execute(): Promise<Result<Customer[], Error>> {
    try {
      const customers = await this.customerRepository.findAll();
      if (customers) {
        return Result.ok(customers);
      } else {
        return Result.fail(new Error('Customers not found'));
      }
    } catch (err: any) {
      return Result.fail(err);
    }
  }
}
