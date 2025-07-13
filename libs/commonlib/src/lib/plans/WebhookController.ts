import { Controller, Post, Req } from '@nestjs/common';
import { BillingService } from './BillingService';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly billingService: BillingService) {}

  @Post('/stripe')
  async handleStripeWebhook(@Req() req) {
    const event = req.body;
    await this.billingService.handleWebhook(event);
  }
}
