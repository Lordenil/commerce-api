import { DeliveryStatus } from 'src/domain/entities/delivery.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'deliveries' })
export class DeliveryOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'transaction_id' })
  transactionId: string;

  @Column()
  address: string;

  @Column()
  status: DeliveryStatus;

  @Column()
  eta: Date;

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();
}
