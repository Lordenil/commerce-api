import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryRepositoryPort } from 'src/domain/ports/delivery.repository.port';
import { Repository } from 'typeorm';
import { DeliveryOrmEntity } from '../db/entities/delivery.orm-entity';
import { Delivery, DeliveryStatus } from 'src/domain/entities/delivery.entity';

@Injectable()
export class DeliveryRepositoryAdapter implements DeliveryRepositoryPort {
  constructor(
    @InjectRepository(DeliveryOrmEntity)
    private readonly ormRepo: Repository<DeliveryOrmEntity>,
  ) {}

  async findByTransactionId(transactionId: string): Promise<Delivery | null> {
    return await this.ormRepo.findOne({ where: { transactionId } });
  }

  async updateStatus(
    id: string,
    status: DeliveryStatus,
    eta?: Date,
  ): Promise<Delivery> {
    const delivery = await this.ormRepo.findOne({ where: { id } });
    if (!delivery) {
      throw new Error('Delivery not found');
    }
    delivery.status = status;
    delivery.eta = eta ?? new Date();
    await this.ormRepo.save(delivery);
    return delivery;
  }

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
