/**
 * Insurance information for a patient
 */
export interface InsuranceInfo {
  id: string;
  provider: string;
  planName?: string;
  planType?: InsurancePlanType;
  memberId: string;
  groupNumber?: string;
  subscriberName?: string;
  subscriberDob?: string;
  relationship?: 'self' | 'spouse' | 'child' | 'other';
  isPrimary: boolean;
  verificationStatus?: InsuranceVerificationStatus;
  verificationDetails?: Record<string, any>;
  cardFrontImageUrl?: string;
  cardBackImageUrl?: string;
  effectiveDate?: Date;
  expirationDate?: Date;
  copay?: {
    primaryCare?: number;
    specialist?: number;
    emergency?: number;
    urgent?: number;
  };
  coinsurance?: number; // percentage
  deductible?: {
    individual?: number;
    family?: number;
    remaining?: number;
  };
  outOfPocketMax?: {
    individual?: number;
    family?: number;
    remaining?: number;
  };
  coverageBenefits?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  lastVerifiedAt?: Date;
}

/**
 * Insurance plan types
 */
export type InsurancePlanType =
  | 'MEDICARE'
  | 'MEDICAID'
  | 'HMO'
  | 'PPO'
  | 'EPO'
  | 'POS'
  | 'HDHP'
  | 'CATASTROPHIC'
  | 'MARKETPLACE'
  | 'WORKERS_COMP'
  | 'OTHER';

/**
 * Insurance verification status
 */
export type InsuranceVerificationStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'FAILED'
  | 'EXPIRED'
  | 'INACTIVE'
  | 'NEEDS_INFORMATION';

/**
 * Request to verify insurance
 */
export interface VerifyInsuranceRequest {
  insuranceId: string;
  serviceType?: string;
  providerNpi?: string;
  estimatedAmount?: number;
  procedureCodes?: string[];
  diagnosisCodes?: string[];
}

/**
 * Response from insurance verification
 */
export interface InsuranceVerificationResponse {
  verified: boolean;
  status: InsuranceVerificationStatus;
  eligibility?: {
    isEligible: boolean;
    inNetwork: boolean;
    message?: string;
    effectiveDate?: Date;
    expirationDate?: Date;
    planDetails?: Record<string, any>;
  };
  benefits?: {
    covered: boolean;
    copay?: number;
    coinsurance?: number;
    deductible?: {
      amount: number;
      remaining: number;
      satisfied: boolean;
    };
    outOfPocketMax?: {
      amount: number;
      remaining: number;
      satisfied: boolean;
    };
    limitations?: string[];
    notes?: string;
  };
  estimatedPatientResponsibility?: number;
  estimatedInsurancePayment?: number;
  message?: string;
  details?: Record<string, any>;
  timestamp: Date;
}
