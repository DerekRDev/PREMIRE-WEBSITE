import {
  Payment,
  RefundPaymentRequest,
  PaymentResponse
} from '../../entities/Payment';

import { PaymentService } from '../../interfaces/services/PaymentService';

export class ManagePaymentUseCase {
  constructor(
    private paymentService: PaymentService
  ) {}

  /**
   * Get a payment by ID
   */
  async getPayment(paymentId: string): Promise<Payment | null> {
    return this.paymentService.getPayment(paymentId);
  }

  /**
   * Get payments for a patient
   */
  async getPatientPayments(patientId: string, limit?: number): Promise<Payment[]> {
    return this.paymentService.getPatientPayments(patientId, limit);
  }

  /**
   * Refund a payment (full or partial)
   */
  async refundPayment(request: RefundPaymentRequest): Promise<PaymentResponse> {
    return this.paymentService.refundPayment(request);
  }

  /**
   * Generate a receipt for a payment
   */
  async generateReceipt(paymentId: string): Promise<{ receiptUrl: string, payment: Payment }> {
    return this.paymentService.generateReceipt(paymentId);
  }

  /**
   * Verify payment status with payment processor
   */
  async verifyPaymentStatus(paymentId: string): Promise<Payment> {
    return this.paymentService.verifyPaymentStatus(paymentId);
  }
}