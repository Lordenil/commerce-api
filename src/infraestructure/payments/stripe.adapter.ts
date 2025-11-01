import { Injectable } from '@nestjs/common';
import { PaymentProviderPort } from 'src/domain/ports/payment-provider.port';
import Stripe from 'stripe';

@Injectable()
export class StripeAdapter implements PaymentProviderPort {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-10-29.clover',
    });
  }

  async charge(
    amountCents: number,
    currency: string,
    paymentMethodId: string,
    metadata?: Record<string, any>,
  ) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountCents,
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      metadata,
    });

    return { status: paymentIntent.status, transactionId: paymentIntent.id };
  }
}
