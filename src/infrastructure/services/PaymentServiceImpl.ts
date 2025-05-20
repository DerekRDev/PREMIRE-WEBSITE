import { 
  Payment, 
  ProcessPaymentRequest, 
  PaymentResponse,
  RefundPaymentRequest
} from '../../core/entities/Payment';

import { PaymentService } from '../../core/interfaces/services/PaymentService';
import { StripeClient } from '../api/payment/StripeClient';
import { SlidingFeeDiscountService } from '../../core/interfaces/services/SlidingFeeDiscountService';

/**
 * Implementation of the Payment Service using Stripe
 */
export class PaymentServiceImpl implements PaymentService {
  private stripeClient: StripeClient;
  private slidingFeeDiscountService: SlidingFeeDiscountService;
  private payments: Payment[] = []; // In-memory storage for mock implementation

  constructor(
    apiKey: string,
    isTestMode: boolean,
    slidingFeeDiscountService: SlidingFeeDiscountService
  ) {
    this.stripeClient = new StripeClient(apiKey, isTestMode);
    this.slidingFeeDiscountService = slidingFeeDiscountService;
  }

  /**
   * Process a payment
   */
  async processPayment(request: ProcessPaymentRequest): Promise<PaymentResponse> {
    try {
      let amount = request.amount;
      let discountApplied = false;
      let discountId: string | undefined;
      let originalAmount = amount;
      
      // Check for discount eligibility if requested
      if (request.applyDiscount) {
        const eligibility = await this.slidingFeeDiscountService.getPatientDiscountEligibility(
          request.patientId
        );
        
        if (eligibility) {
          // Apply the discount
          amount = await this.slidingFeeDiscountService.calculateDiscountedAmount(
            amount,
            eligibility.discountTier,
            request.serviceType as any // Type conversion needed
          );
          
          discountApplied = true;
          discountId = eligibility.id;
        }
      }
      
      // Convert amount to cents for Stripe
      const amountInCents = Math.round(amount * 100);
      
      // Create payment intent with Stripe
      const paymentIntent = await this.stripeClient.createPaymentIntent({
        amount: amountInCents,
        currency: 'usd',
        description: `Payment for ${request.serviceType.toLowerCase()}`,
        metadata: {
          patientId: request.patientId,
          serviceType: request.serviceType,
          ...(request.serviceId && { serviceId: request.serviceId }),
          ...(request.appointmentId && { appointmentId: request.appointmentId }),
          ...(request.referralId && { referralId: request.referralId }),
          ...(request.intakeId && { intakeId: request.intakeId }),
          ...(request.metadata && { ...request.metadata })
        }
      });
      
      // Create a receipt URL
      const receiptUrl = await this.stripeClient.createReceipt(paymentIntent.id);
      
      // Create payment record
      const payment: Payment = {
        id: `payment-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        patientId: request.patientId,
        amount,
        originalAmount,
        discountedAmount: discountApplied ? amount : undefined,
        discountApplied,
        discountId,
        currency: 'USD',
        status: 'COMPLETED',
        paymentMethod: request.paymentMethod,
        paymentDate: new Date(),
        lastUpdated: new Date(),
        transactionId: paymentIntent.id,
        receiptNumber: `REC-${Date.now()}`,
        serviceType: request.serviceType,
        serviceId: request.serviceId,
        appointmentId: request.appointmentId,
        referralId: request.referralId,
        intakeId: request.intakeId,
        notes: request.notes,
        metadata: {
          clientSecret: paymentIntent.clientSecret,
          stripeStatus: paymentIntent.status,
          ...(request.metadata || {})
        }
      };
      
      // Store the payment (in a real app, this would save to a database)
      this.payments.push(payment);
      
      return {
        payment,
        receiptUrl,
        message: 'Payment processed successfully',
        success: true
      };
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        payment: null as unknown as Payment,
        message: `Error processing payment: ${error instanceof Error ? error.message : String(error)}`,
        success: false
      };
    }
  }

  /**
   * Get a payment by ID
   */
  async getPayment(paymentId: string): Promise<Payment | null> {
    return this.payments.find(p => p.id === paymentId) || null;
  }

  /**
   * List payments for a patient
   */
  async getPatientPayments(patientId: string, limit?: number): Promise<Payment[]> {
    const patientPayments = this.payments
      .filter(p => p.patientId === patientId)
      .sort((a, b) => b.paymentDate.getTime() - a.paymentDate.getTime());
    
    return limit ? patientPayments.slice(0, limit) : patientPayments;
  }

  /**
   * Refund a payment partially or fully
   */
  async refundPayment(request: RefundPaymentRequest): Promise<PaymentResponse> {
    try {
      // Find the payment
      const payment = await this.getPayment(request.paymentId);
      
      if (!payment) {
        return {
          payment: null as unknown as Payment,
          message: `Payment with ID ${request.paymentId} not found`,
          success: false
        };
      }
      
      // Calculate refund amount
      const refundAmount = request.amount || payment.amount;
      
      // Process refund with Stripe
      await this.stripeClient.createRefund({
        paymentIntent: payment.transactionId!,
        amount: Math.round(refundAmount * 100), // Convert to cents
        reason: request.reason
      });
      
      // Update payment record
      const updatedPayment: Payment = {
        ...payment,
        status: refundAmount === payment.amount ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
        lastUpdated: new Date(),
        refundAmount,
        refundDate: new Date(),
        refundReason: request.reason
      };
      
      // Update in our store
      const index = this.payments.findIndex(p => p.id === payment.id);
      this.payments[index] = updatedPayment;
      
      return {
        payment: updatedPayment,
        message: `Payment refunded successfully (${refundAmount} ${payment.currency})`,
        success: true
      };
    } catch (error) {
      console.error('Error refunding payment:', error);
      return {
        payment: null as unknown as Payment,
        message: `Error refunding payment: ${error instanceof Error ? error.message : String(error)}`,
        success: false
      };
    }
  }

  /**
   * Generate a receipt for a payment
   */
  async generateReceipt(paymentId: string): Promise<{ receiptUrl: string, payment: Payment }> {
    const payment = await this.getPayment(paymentId);
    
    if (!payment) {
      throw new Error(`Payment with ID ${paymentId} not found`);
    }
    
    if (!payment.transactionId) {
      throw new Error(`Payment has no transaction ID`);
    }
    
    const receiptUrl = await this.stripeClient.createReceipt(payment.transactionId);
    
    return { receiptUrl, payment };
  }

  /**
   * Verify payment status with payment processor
   */
  async verifyPaymentStatus(paymentId: string): Promise<Payment> {
    const payment = await this.getPayment(paymentId);
    
    if (!payment) {
      throw new Error(`Payment with ID ${paymentId} not found`);
    }
    
    if (!payment.transactionId) {
      throw new Error(`Payment has no transaction ID`);
    }
    
    // In a real implementation, this would verify the payment with Stripe
    const paymentIntent = await this.stripeClient.retrievePaymentIntent(payment.transactionId);
    
    // Update payment status based on Stripe status
    let status: Payment['status'] = payment.status;
    
    if (paymentIntent.status === 'succeeded') {
      status = 'COMPLETED';
    } else if (paymentIntent.status === 'processing') {
      status = 'PROCESSING';
    } else if (paymentIntent.status === 'canceled') {
      status = 'CANCELLED';
    } else if (paymentIntent.status === 'requires_payment_method') {
      status = 'PENDING';
    } else if (paymentIntent.status === 'requires_capture') {
      // Capture the payment
      await this.stripeClient.capturePaymentIntent(payment.transactionId);
      status = 'COMPLETED';
    }
    
    // Update the payment
    const updatedPayment: Payment = {
      ...payment,
      status,
      lastUpdated: new Date()
    };
    
    // Update in our store
    const index = this.payments.findIndex(p => p.id === payment.id);
    this.payments[index] = updatedPayment;
    
    return updatedPayment;
  }
}