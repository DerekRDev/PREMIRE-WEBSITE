import {
  ProcessPaymentRequest,
  PaymentResponse
} from '../../entities/Payment';

import {
  CheckDiscountEligibilityRequest,
  DiscountEligibilityResponse
} from '../../entities/Payment';

import { PaymentService } from '../../interfaces/services/PaymentService';
import { SlidingFeeDiscountService } from '../../interfaces/services/SlidingFeeDiscountService';
import { InsuranceVerificationService } from '../../interfaces/services/InsuranceVerificationService';

export class ProcessPaymentUseCase {
  constructor(
    private paymentService: PaymentService,
    private discountService: SlidingFeeDiscountService,
    private insuranceService?: InsuranceVerificationService
  ) {}

  /**
   * Process a payment
   */
  async execute(request: ProcessPaymentRequest): Promise<PaymentResponse> {
    return this.paymentService.processPayment(request);
  }

  /**
   * Check patient's discount eligibility
   */
  async checkDiscountEligibility(
    request: CheckDiscountEligibilityRequest
  ): Promise<DiscountEligibilityResponse> {
    return this.discountService.checkDiscountEligibility(request);
  }

  /**
   * Calculate estimated total cost based on insurance and discount eligibility
   */
  async calculateEstimatedCost(options: {
    patientId: string;
    serviceType: string;
    originalAmount: number;
    insuranceId?: string;
    householdSize?: number;
    annualIncome?: number;
    procedureCodes?: string[];
    diagnosisCodes?: string[];
  }): Promise<{
    originalAmount: number;
    discountedAmount?: number;
    estimatedInsurancePayment?: number;
    estimatedPatientResponsibility: number;
    discountApplied: boolean;
    insuranceApplied: boolean;
    savingsAmount: number;
    savingsPercentage: number;
    message: string;
  }> {
    let discountEligibilityResponse: DiscountEligibilityResponse | null = null;
    let insuranceResponse: any = null;
    
    // Step 1: Check discount eligibility
    if (options.householdSize && options.annualIncome) {
      discountEligibilityResponse = await this.discountService.checkDiscountEligibility({
        patientId: options.patientId,
        householdSize: options.householdSize,
        annualIncome: options.annualIncome,
        serviceType: options.serviceType as any, // Type conversion
        originalAmount: options.originalAmount
      });
    } else {
      // Try to find existing eligibility
      const eligibility = await this.discountService.getPatientDiscountEligibility(
        options.patientId
      );
      
      if (eligibility) {
        discountEligibilityResponse = await this.discountService.checkDiscountEligibility({
          patientId: options.patientId,
          serviceType: options.serviceType as any, // Type conversion
          originalAmount: options.originalAmount
        });
      }
    }
    
    // Step 2: Check insurance coverage if applicable
    if (options.insuranceId && this.insuranceService) {
      try {
        insuranceResponse = await this.insuranceService.estimatePatientResponsibility(
          options.insuranceId,
          options.serviceType,
          options.originalAmount,
          options.procedureCodes,
          options.diagnosisCodes
        );
      } catch (error) {
        console.error('Error getting insurance estimate:', error);
        // Continue without insurance estimate
      }
    }
    
    // Step 3: Calculate the final estimated cost
    let discountedAmount = options.originalAmount;
    let estimatedInsurancePayment = 0;
    let estimatedPatientResponsibility = options.originalAmount;
    let discountApplied = false;
    let insuranceApplied = false;
    
    // Apply discount if eligible
    if (discountEligibilityResponse?.eligible && discountEligibilityResponse?.discountedAmount) {
      discountedAmount = discountEligibilityResponse.discountedAmount;
      discountApplied = true;
    }
    
    // Apply insurance if available
    if (insuranceResponse) {
      estimatedInsurancePayment = insuranceResponse.estimatedInsurancePayment;
      estimatedPatientResponsibility = insuranceResponse.estimatedPatientResponsibility;
      insuranceApplied = true;
      
      // If both insurance and discount apply, use the lower amount
      if (discountApplied) {
        estimatedPatientResponsibility = Math.min(
          estimatedPatientResponsibility,
          discountedAmount
        );
      }
    } else if (discountApplied) {
      // If only discount applies
      estimatedPatientResponsibility = discountedAmount;
    }
    
    // Calculate savings
    const savingsAmount = options.originalAmount - estimatedPatientResponsibility;
    const savingsPercentage = (savingsAmount / options.originalAmount) * 100;
    
    // Construct message
    let message = '';
    if (insuranceApplied && discountApplied) {
      message = `Estimated cost includes both insurance coverage and a sliding fee discount.`;
    } else if (insuranceApplied) {
      message = `Estimated cost includes insurance coverage.`;
    } else if (discountApplied) {
      message = `Estimated cost includes a sliding fee discount.`;
    } else {
      message = `No discounts or insurance coverage applied.`;
    }
    
    return {
      originalAmount: options.originalAmount,
      discountedAmount: discountApplied ? discountedAmount : undefined,
      estimatedInsurancePayment: insuranceApplied ? estimatedInsurancePayment : undefined,
      estimatedPatientResponsibility,
      discountApplied,
      insuranceApplied,
      savingsAmount,
      savingsPercentage,
      message
    };
  }
}