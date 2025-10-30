import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'customers' })
export class CustomerOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ name: 'stripe_customer_id', nullable: true })
  stripeCustomerId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
