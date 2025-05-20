import {
  SlidingFeeDiscount,
  FederalPovertyGuideline,
  PatientDiscountEligibility,
  ApplyForDiscountRequest,
  DiscountApplicationResponse,
  ServiceType
} from '../../entities/SlidingFeeDiscount';

import {
  CheckDiscountEligibilityRequest,
  DiscountEligibilityResponse
} from '../../entities/Payment';

/**
 * Interface for sliding fee discount service
 */
export interface SlidingFeeDiscountService {
  /**
   * Get current Federal Poverty Guidelines
   */
  getCurrentFPG(): Promise<FederalPovertyGuideline>;
  
  /**
   * Get FPG for a specific year
   */
  getFPGByYear(year: number): Promise<FederalPovertyGuideline>;
  
  /**
   * Calculate the Federal Poverty Level percentage for a household
   * @param annualIncome Annual household income in dollars
   * @param householdSize Number of people in household
   * @param state Two-letter state code (for Alaska and Hawaii adjustments)
   * @returns Percentage of Federal Poverty Level (e.g. 138 for 138% FPL)
   */
  calculateFPLPercentage(
    annualIncome: number, 
    householdSize: number, 
    state?: string
  ): Promise<number>;
  
  /**
   * Get all active discount tiers
   */
  getDiscountTiers(): Promise<SlidingFeeDiscount[]>;
  
  /**
   * Determine the discount tier for a patient based on income and household size
   */
  determineDiscountTier(
    annualIncome: number, 
    householdSize: number,
    state?: string
  ): Promise<SlidingFeeDiscount | null>;
  
  /**
   * Apply for sliding fee discount
   */
  applyForDiscount(
    request: ApplyForDiscountRequest
  ): Promise<DiscountApplicationResponse>;
  
  /**
   * Check if a patient is eligible for a discount
   */
  checkDiscountEligibility(
    request: CheckDiscountEligibilityRequest
  ): Promise<DiscountEligibilityResponse>;
  
  /**
   * Calculate discounted amount for a service
   */
  calculateDiscountedAmount(
    originalAmount: number,
    discountTier: number,
    serviceType: ServiceType
  ): Promise<number>;
  
  /**
   * Get a patient's current discount eligibility
   */
  getPatientDiscountEligibility(
    patientId: string
  ): Promise<PatientDiscountEligibility | null>;
  
  /**
   * Update Federal Poverty Guidelines for a new year
   */
  updateFederalPovertyGuidelines(
    fpg: FederalPovertyGuideline
  ): Promise<FederalPovertyGuideline>;
  
  /**
   * Update discount tiers
   */
  updateDiscountTier(
    discountTier: SlidingFeeDiscount
  ): Promise<SlidingFeeDiscount>;
}