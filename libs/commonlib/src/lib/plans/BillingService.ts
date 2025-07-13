import Stripe from 'stripe';
import { environmentConfig } from '../config/EnvironmentConfig';

export class BillingService {
  private static getStripe(): Stripe | null {
    const stripeConfig = environmentConfig.getStripeConfig();
    if (!stripeConfig) {
      return null;
    }
    
    return new Stripe(stripeConfig.stripeKey, { 
      apiVersion: '2024-09-30.acacia' 
    });
  }

  static async createCheckoutSession(
    email: string,
    userId: string,
    planId: string,
    stripePriceId: string,
    startDate: Date,
    endDate: Date
  ) {
    const stripe = this.getStripe();
    if (!stripe) {
      throw new Error('Stripe is not configured. Billing features are only available in the cloud version.');
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email,
        client_reference_id: userId,
        line_items: [{
          price: stripePriceId,
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: 'http://create.playdigidash.io/AppSettings/?payment=success',
        cancel_url: 'http://create.playdigidash.io/AppSettings/?payment=cancel',
        allow_promotion_codes: true,
        metadata: {
          uid: userId, 
          planId: planId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
  
      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  static async cancelSubscription(subscriptionId: string): Promise<void> {
    const stripe = this.getStripe();
    if (!stripe) {
      throw new Error('Stripe is not configured. Billing features are only available in the cloud version.');
    }

    try {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }
}