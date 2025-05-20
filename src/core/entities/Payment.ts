/**
 * Represents a payment in the Premier Healthcare platform
 */
export interface Payment {
  id: string;
  patientId: string;
  amount: number;
  discountedAmount?: number;
  originalAmount: number;
  discountApplied: boolean;
  discountId?: string;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  lastUpdated: Date;
  transactionId?: string;
  receiptNumber?: string;
  serviceType: ServiceType;
  serviceId?: string;
  appointmentId?: string;
  referralId?: string;
  intakeId?: string;
  notes?: string;
  refundAmount?: number;
  refundDate?: Date;
  refundReason?: string;
  metadata?: Record<string, any>;
}

/**
 * Possible payment statuses
 */
export type PaymentStatus = 
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | 'CANCELLED';

/**
 * Supported payment methods
 */
export type PaymentMethod = 
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'CASH'
  | 'CHECK'
  | 'BANK_TRANSFER'
  | 'PAYMENT_PLAN'
  | 'MEDICARE'
  | 'MEDICAID'
  | 'INSURANCE'
  | 'APPLE_PAY'
  | 'GOOGLE_PAY'
  | 'OTHER';

/**
 * Types of services that can be paid for
 */
export type ServiceType = 
  | 'APPOINTMENT'
  | 'REFERRAL'
  | 'PROCEDURE'
  | 'MEDICATION'
  | 'LABORATORY'
  | 'IMAGING'
  | 'DENTAL'
  | 'OTHER';

/**
 * Request to process a new payment
 */
export interface ProcessPaymentRequest {
  patientId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  serviceType: ServiceType;
  serviceId?: string;
  appointmentId?: string;
  referralId?: string;
  intakeId?: string;
  applyDiscount?: boolean;
  notes?: string;
  metadata?: Record<string, any>;
}

/**
 * Response after processing a payment
 */
export interface PaymentResponse {
  payment: Payment;
  receiptUrl?: string;
  message: string;
  success: boolean;
}

/**
 * Request to refund a payment
 */
export interface RefundPaymentRequest {
  paymentId: string;
  amount?: number; // If not provided, full refund is assumed
  reason: string;
}

/**
 * Request to check payment eligibility for discount
 */
export interface CheckDiscountEligibilityRequest {
  patientId: string;
  householdSize: number;
  annualIncome: number;
  serviceType: ServiceType;
  originalAmount: number;
}

/**
 * Response with discount eligibility information
 */
export interface DiscountEligibilityResponse {
  eligible: boolean;
  discountTier?: number;
  discountPercentage?: number;
  discountedAmount?: number;
  originalAmount: number;
  message: string;
}