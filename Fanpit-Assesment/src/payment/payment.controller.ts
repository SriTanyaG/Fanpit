import { Controller, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-order')
  async createOrder(@Body() body: { amount: number; currency?: string }) {
    try {
      const order = await this.paymentService.createOrder(
        body.amount,
        body.currency
      );
      return { success: true, data: order };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('verify')
  async verifyPayment(
    @Body()
    body: {
      paymentId: string;
      orderId: string;
      signature: string;
    }
  ) {
    try {
      const isValid = await this.paymentService.verifyPayment(
        body.paymentId,
        body.orderId,
        body.signature
      );

      if (!isValid) {
        throw new BadRequestException('Invalid payment signature');
      }

      const paymentDetails = await this.paymentService.getPaymentDetails(
        body.paymentId
      );

      return {
        success: true,
        data: paymentDetails,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
