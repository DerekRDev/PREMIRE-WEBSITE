/**
 * Represents a sliding fee discount program tier based on Federal Poverty Guidelines
 */
export interface SlidingFeeDiscount {
  id: string;
  name: string;
  tier: number;
  discountPercentage: number;
  povertyLevelMin: number; // Min poverty level percentage (e.g., 0% of FPL)
  povertyLevelMax: number; // Max poverty level percentage (e.g., 100% of FPL)
  isActive: boolean;
  effectiveDate: Date;
  expirationDate?: Date;
  serviceTypes: ServiceType[];
  nominalFees?: Record<ServiceType, number>; // Fixed nominal fees for certain service types
}

/**
 * Types of services that can have sliding fee discounts
 */
export type ServiceType = 
  | 'MEDICAL'
  | 'DENTAL'
  | 'BEHAVIORAL'
  | 'PHARMACY'
  | 'LABORATORY'
  | 'IMAGING'
  | 'PROCEDURE'
  | 'OTHER';

/**
 * Federal Poverty Level guidelines for a specific year
 */
export interface FederalPovertyGuideline {
  year: number;
  isActive: boolean;
  basePovertyLevel: number; // Base amount for household of 1
  additionalPersonAmount: number; // Amount added for each additional person
  alaskaMultiplier: number; // Alaska has higher FPL (typically 1.25x)
  hawaiiMultiplier: number; // Hawaii has higher FPL (typically 1.15x)
}

/**
 * Income verification document types
 */
export type IncomeVerificationType =
  | 'PAY_STUB'
  | 'TAX_RETURN'
  | 'W2'
  | 'SOCIAL_SECURITY'
  | 'UNEMPLOYMENT'
  | 'DISABILITY'
  | 'SELF_EMPLOYMENT'
  | 'BANK_STATEMENT'
  | 'EMPLOYER_LETTER'
  | 'OTHER';

/**
 * Patient discount eligibility record
 */
export interface PatientDiscountEligibility {
  id: string;
  patientId: string;
  householdSize: number;
  annualIncome: number;
  discountTier: number;
  discountPercentage: number;
  verificationDocuments: IncomeVerificationDocument[];
  approvedBy?: string;
  approvalDate?: Date;
  effectiveDate: Date;
  expirationDate: Date;
  status: EligibilityStatus;
  notes?: string;
  lastReviewDate?: Date;
}

/**
 * Income verification document
 */
export interface IncomeVerificationDocument {
  id: string;
  type: IncomeVerificationType;
  documentUrl?: string;
  uploadDate: Date;
  verified: boolean;
  verifiedBy?: string;
  verificationDate?: Date;
  notes?: string;
}

/**
 * Eligibility status
 */
export type EligibilityStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'DENIED'
  | 'EXPIRED'
  | 'UNDER_REVIEW';

/**
 * Request to apply for sliding fee discount
 */
export interface ApplyForDiscountRequest {
  patientId: string;
  householdSize: number;
  annualIncome: number;
  verificationDocuments: {
    type: IncomeVerificationType;
    documentUrl?: string;
    notes?: string;
  }[];
  notes?: string;
}

/**
 * Response after applying for sliding fee discount
 */
export interface DiscountApplicationResponse {
  eligibility?: PatientDiscountEligibility;
  message: string;
  success: boolean;
  nextSteps?: string[];
}