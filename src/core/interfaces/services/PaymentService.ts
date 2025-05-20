import { 
  Payment, 
  ProcessPaymentRequest, 
  PaymentResponse,
  RefundPaymentRequest
} from '../../entities/Payment';

/**
 * Interface for payment processing service
 */
export interface PaymentService {
  /**
   * Process a payment
   */
  processPayment(request: ProcessPaymentRequest): Promise<PaymentResponse>;
  
  /**
   * Get a payment by ID
   */
  getPayment(paymentId: string): Promise<Payment | null>;
  
  /**
   * List payments for a patient
   */
  getPatientPayments(patientId: string, limit?: number): Promise<Payment[]>;
  
  /**
   * Refund a payment partially or fully
   */
  refundPayment(request: RefundPaymentRequest): Promise<PaymentResponse>;
  
  /**
   * Generate a receipt for a payment
   */
  generateReceipt(paymentId: string): Promise<{ receiptUrl: string, payment: Payment }>;
  
  /**
   * Verify payment status with payment processor
   */
  verifyPaymentStatus(paymentId: string): Promise<Payment>;
}