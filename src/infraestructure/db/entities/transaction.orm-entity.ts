import { TransactionStatus } from 'src/domain/entities/transaction.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'transactions' })
export class TransactionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'amount' })
  amount: number;

  @Column()
  currency: string;

  @Column()
  status: TransactionStatus;

  @Column({ name: 'payment_method_id' })
  paymentMethodId: string;

  @Column()
  last4: string;

  @Column()
  brand: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ name: 'wompi_transaction_id', nullable: true })
  wompiTransactionId?: string;

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
