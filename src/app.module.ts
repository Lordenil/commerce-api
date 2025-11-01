import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './infraestructure/db/entities/typeorm.config';
import { ProductModule } from './infraestructure/product.module';
import { CustomerModule } from './infraestructure/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ProductModule,
    CustomerModule,
  ],
})
export class AppModule {}
