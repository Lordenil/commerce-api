import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerOrmEntity } from '../db/entities/customer.orm-entity';
import { Customer } from 'src/domain/entities/customer.entity';
import { CustomerRepositoryPort } from 'src/domain/ports/customer.repository.port';

@Injectable()
export class CustomerRepositoryAdapter implements CustomerRepositoryPort {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly ormRepo: Repository<CustomerOrmEntity>,
  ) {}

  async save(customer: Customer): Promise<Customer> {
    const entity = this.ormRepo.create(customer);
    const saved = await this.ormRepo.save(entity);
    return saved;
  }

  async findAll(): Promise<Customer[]> {
    return await this.ormRepo.find();
  }

  async findById(id: string): Promise<Customer | null> {
    return await this.ormRepo.findOne({ where: { id } });
  }
}
