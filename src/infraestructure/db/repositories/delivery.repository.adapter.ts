import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryRepositoryPort } from 'src/domain/ports/inbound/delivery.repository.port';
import { Repository } from 'typeorm';
import { DeliveryOrmEntity } from '../entities/delivery.orm-entity';
import { Delivery } from 'src/domain/entities/delivery.entity';

@Injectable()
export class DeliveryRepositoryAdapter implements DeliveryRepositoryPort {
  constructor(
    @InjectRepository(DeliveryOrmEntity)
    private readonly ormRepo: Repository<DeliveryOrmEntity>,
  ) {}

  async save(delivery: Delivery): Promise<Delivery> {
    const entity = this.ormRepo.create(delivery);
    const saved = await this.ormRepo.save(entity);
    return saved;
  }

  async findAll(): Promise<Delivery[]> {
    return await this.ormRepo.find();
  }

  async findById(id: string): Promise<Delivery | null> {
    return await this.ormRepo.findOne({ where: { id } });
  }
}
