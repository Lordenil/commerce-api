import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CustomerOrmEntity } from './customer.orm-entity';
import { DeliveryOrmEntity } from './delivery.orm-entity';
import { TransactionOrmEntity } from './transaction.orm-entity';
import { ProductOrmEntity } from './product.orm-entity';
import dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [
    ProductOrmEntity,
    CustomerOrmEntity,
    TransactionOrmEntity,
    DeliveryOrmEntity,
  ],
  synchronize: process.env.SYNCHRONIZE === 'true',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};
