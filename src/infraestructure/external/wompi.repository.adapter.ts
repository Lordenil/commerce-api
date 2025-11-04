import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  WompiTransactionRequestDto,
  WompiTransactionResponseDto,
} from 'src/application/use-cases/dto/wompi-transaction.dto';
import { WompiRepositoryPort } from 'src/domain/ports/wompi.repository.port';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import { sha256 } from 'js-sha256';

export interface WompiCreditCard {
  number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
  card_holder: string;
}

export interface WompiCodifyTransaction {
  reference: string;
  amount_in_cents: string;
  currency: string;
  integrity_key: string;
}

@Injectable()
export class WompiRepositoryAdapter implements WompiRepositoryPort {
  private readonly baseUrl = process.env.WOMPI_BASE_URL;
  private readonly publicKey = process.env.WOMPI_PUBLIC_KEY;
  private readonly privateKey = process.env.WOMPI_PRIVATE_KEY;
  private readonly eventSecret = process.env.WOMPI_EVENT_SECRET;
  private readonly integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

  constructor(private readonly httpService: HttpService) {}

  async createToken(request: WompiCreditCard): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/tokens/cards`, request, {
          headers: {
            Authorization: `Bearer ${this.publicKey}`,
            'Content-Type': 'application/json',
            'Accept-Version': 'v1',
          },
        }),
      );

      return response.data;
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async acceptanceToken(): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/merchants/${this.publicKey}`),
      );

      return response.data.data.presigned_acceptance.acceptance_token;
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  codifyTransaction(wompiCodifyTransaction: WompiCodifyTransaction) {
    const integrity_signature = sha256(
      wompiCodifyTransaction.reference +
        wompiCodifyTransaction.amount_in_cents +
        wompiCodifyTransaction.currency +
        wompiCodifyTransaction.integrity_key,
    );
    return integrity_signature;
  }

  async createTransaction(
    request: WompiTransactionRequestDto,
  ): Promise<WompiTransactionResponseDto> {
    try {
      const tokenRequest: WompiCreditCard = {
        number: request.paymentMethod.numberCard,
        exp_month: request.paymentMethod.expMonth,
        exp_year: request.paymentMethod.expYear,
        cvc: request.paymentMethod.cvc,
        card_holder: request.shippingAddress.name,
      };

      const token = await this.createToken(tokenRequest);
      const acceptanceToken = await this.acceptanceToken();
      const integrityKey = this.codifyTransaction({
        reference: request.reference,
        amount_in_cents: `${request.amountInCents}`,
        currency: request.currency,
        integrity_key: `${this.integritySecret}`,
      });

      const transactionRequest = {
        amount_in_cents: request.amountInCents,
        currency: request.currency,
        customer_email: request.customerEmail,
        payment_method: {
          type: 'CARD',
          token: token['data']['id'],
          installments: request.paymentMethod.installments || 1,
        },
        reference: request.reference,
        signature: integrityKey,
        shipping_address: {
          name: request.shippingAddress.name,
          address_line_1: request.shippingAddress.addressLine1,
          country: request.shippingAddress.country,
          region: request.shippingAddress.region,
          city: request.shippingAddress.city,
          phone_number: request.shippingAddress.phoneNumber,
          postal_code: request.shippingAddress.postalCode,
        },
        acceptance_token: acceptanceToken,
      };

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/transactions`,
          transactionRequest,
          {
            headers: {
              Authorization: `Bearer ${this.privateKey}`,
              'Content-Type': 'application/json',
              'Accept-Version': 'v1',
            },
          },
        ),
      );

      return response.data;
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
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
