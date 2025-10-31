import { Result } from '../../domain/result';
import { Injectable } from 'src/shared/dependency-injection/injectable';
import { CustomerRepositoryPort } from 'src/domain/ports/customer.repository.port';
import { Customer } from 'src/domain/entities/customer.entity';
import { FindCustomerByIdDto } from './dto/find-customer-by-id.dto';

@Injectable()
export class FindCustomerByIdUseCase {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async execute(
    findCustomerById: FindCustomerByIdDto,
  ): Promise<Result<Customer, Error>> {
    try {
      const customer = await this.customerRepository.findById(
        findCustomerById.id,
      );
      if (customer) {
        return Result.ok(customer);
      } else {
        return Result.fail(new Error('Customer not found'));
      }
    } catch (err: any) {
      return Result.fail(err);
    }
  }
}
