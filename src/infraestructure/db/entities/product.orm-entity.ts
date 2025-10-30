import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class ProductOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  sku: string;

  @Column({ type: 'int', name: 'price_cents' })
  priceCents: number;

  @Column()
  currency: string;

  @Column({ type: 'int' })
  stock: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
