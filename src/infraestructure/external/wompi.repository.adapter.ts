import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  WompiTransactionRequestDto,
  WompiTransactionResponseDto,
} from 'src/application/use-cases/dto/wompi-transaction.dto';
import { WompiRepositoryPort } from 'src/domain/ports/wompi.repository.port';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class WompiRepositoryAdapter implements WompiRepositoryPort {
  private readonly baseUrl =
    process.env.WOMPI_BASE_URL ?? 'https://sandbox.wompi.co/v1';
  private readonly publicKey = process.env.WOMPI_PUBLIC_KEY;
  private readonly privateKey = process.env.WOMPI_PRIVATE_KEY;
  private readonly eventSecret = process.env.WOMPI_EVENT_SECRET;

  constructor(private readonly httpService: HttpService) {}

  async createTransaction(
    request: WompiTransactionRequestDto,
  ): Promise<WompiTransactionResponseDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/transactions`, request, {
          headers: {
            Authorization: `Bearer ${this.privateKey}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      return response.data;
    } catch (error: any) {
      throw new HttpException(
        'Failed to create transaction in Wompi',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getTransaction(transactionId: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/transactions/${transactionId}`, {
          headers: {
            Authorization: `Bearer ${this.publicKey}`,
          },
        }),
      );

      return response.data;
    } catch (error: any) {
      throw new HttpException(
        'Failed to fetch transaction from Wompi',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyWebhookSignature(
    reference: string,
    signature: string,
  ): Promise<boolean> {
    if (!this.eventSecret) {
      throw new Error('WOMPI_EVENT_SECRET is not configured');
    }

    const computedSignature = crypto
      .createHmac('sha256', this.eventSecret)
      .update(reference)
      .digest('hex');

    return computedSignature === signature;
  }
}
