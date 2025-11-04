import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { WompiRepositoryAdapter } from './wompi.repository.adapter';
import { of, throwError } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import { sha256 } from 'js-sha256';
import { AxiosResponse } from 'axios';

process.env.WOMPI_BASE_URL = 'https://sandbox.wompi.co/v1';
process.env.WOMPI_PUBLIC_KEY = 'public_test_key';
process.env.WOMPI_PRIVATE_KEY = 'private_test_key';
process.env.WOMPI_EVENT_SECRET = 'event_secret';
process.env.WOMPI_INTEGRITY_SECRET = 'integrity_secret';

const mockAxiosResponse: AxiosResponse = {
  data: {
    data: { id: 'tok_123' },
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  request: {},
  config: {
    headers: {},
  } as any,
};

describe('WompiRepositoryAdapter', () => {
  let adapter: WompiRepositoryAdapter;
  let httpService: jest.Mocked<HttpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WompiRepositoryAdapter,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    adapter = module.get<WompiRepositoryAdapter>(WompiRepositoryAdapter);
    httpService = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  describe('createToken', () => {
    it('should create a token successfully', async () => {
      const mockResponse = { ...mockAxiosResponse };
      httpService.post.mockReturnValue(of(mockResponse));

      const result = await adapter.createToken({
        number: '4242424242424242',
        exp_month: '12',
        exp_year: '2030',
        cvc: '123',
        card_holder: 'John Doe',
      });

      expect(result).toEqual(mockResponse.data);
      expect(httpService.post).toHaveBeenCalledWith(
        `${process.env.WOMPI_BASE_URL}/tokens/cards`,
        expect.any(Object),
        expect.any(Object),
      );
    });

    it('should throw HttpException on error', async () => {
      httpService.post.mockReturnValue(
        throwError(() => new Error('API error')),
      );

      await expect(
        adapter.createToken({
          number: '4242',
          exp_month: '12',
          exp_year: '2030',
          cvc: '123',
          card_holder: 'John Doe',
        }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('acceptanceToken', () => {
    it('should return acceptance token', async () => {
      const mockResponse = {
        ...mockAxiosResponse,
        data: {
          data: { presigned_acceptance: { acceptance_token: 'accept_123' } },
        },
      };

      httpService.get.mockReturnValue(of(mockResponse));

      const result = await adapter.acceptanceToken();
      expect(result).toBe('accept_123');
      expect(httpService.get).toHaveBeenCalledWith(
        `${process.env.WOMPI_BASE_URL}/merchants/${process.env.WOMPI_PUBLIC_KEY}`,
      );
    });

    it('should throw HttpException on failure', async () => {
      httpService.get.mockReturnValue(
        throwError(() => new Error('Bad Request')),
      );
      await expect(adapter.acceptanceToken()).rejects.toThrow(HttpException);
    });
  });

  describe('codifyTransaction', () => {
    it('should return sha256 signature', () => {
      const mockInput = {
        reference: 'ref123',
        amount_in_cents: '1000',
        currency: 'COP',
        integrity_key: 'secret',
      };
      const result = adapter.codifyTransaction(mockInput);
      expect(result).toBe(
        sha256(
          mockInput.reference +
            mockInput.amount_in_cents +
            mockInput.currency +
            mockInput.integrity_key,
        ),
      );
    });
  });

  describe('createTransaction', () => {
    it('should throw HttpException on API error', async () => {
      jest
        .spyOn(adapter, 'createToken')
        .mockRejectedValue(new Error('Token error'));
      await expect(
        adapter.createTransaction({
          amountInCents: 1000,
          customerEmail: 'test@mail.com',
          currency: 'COP',
          reference: 'ref_1',
          paymentMethod: {
            numberCard: '4242',
            expMonth: '12',
            expYear: '2030',
            cvc: '123',
            installments: 1,
            type: 'CARD',
          },
          shippingAddress: {
            name: 'John Doe',
            addressLine1: 'Street 123',
            country: 'CO',
            region: 'Antioquia',
            city: 'Medellin',
            phoneNumber: '3001234567',
            postalCode: '050021',
          },
        }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getTransaction', () => {
    it('should return transaction data', async () => {
      const mockResponse = {
        ...mockAxiosResponse,
        data: { id: 'txn_123', status: 'APPROVED' },
      };
      httpService.get.mockReturnValue(of(mockResponse));

      const result = await adapter.getTransaction('txn_123');
      expect(result).toEqual(mockResponse.data);
      expect(httpService.get).toHaveBeenCalledWith(
        `${process.env.WOMPI_BASE_URL}/transactions/txn_123`,
        {
          headers: { Authorization: `Bearer ${process.env.WOMPI_PUBLIC_KEY}` },
        },
      );
    });

    it('should throw HttpException when API fails', async () => {
      httpService.get.mockReturnValue(
        throwError(() => new Error('API failed')),
      );
      await expect(adapter.getTransaction('invalid')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('verifyWebhookSignature', () => {
    it('should return true for valid signature', async () => {
      const mockRef = 'ref123';
      const validSignature = crypto
        .createHmac('sha256', process.env.WOMPI_EVENT_SECRET!)
        .update(mockRef)
        .digest('hex');

      const result = await adapter.verifyWebhookSignature(
        mockRef,
        validSignature,
      );
      expect(result).toBe(true);
    });

    it('should return false for invalid signature', async () => {
      const result = await adapter.verifyWebhookSignature(
        'ref123',
        'invalid_signature',
      );
      expect(result).toBe(false);
    });

    it('should throw if WOMPI_EVENT_SECRET is missing', async () => {
      const originalSecret = process.env.WOMPI_EVENT_SECRET;
      delete process.env.WOMPI_EVENT_SECRET;

      const newAdapter = new WompiRepositoryAdapter(httpService);
      await expect(
        newAdapter.verifyWebhookSignature('ref', 'sig'),
      ).rejects.toThrow('WOMPI_EVENT_SECRET is not configured');

      process.env.WOMPI_EVENT_SECRET = originalSecret;
    });
  });
});
