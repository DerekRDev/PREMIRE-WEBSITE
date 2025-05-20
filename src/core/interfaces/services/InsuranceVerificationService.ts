import {
  InsuranceInfo,
  VerifyInsuranceRequest,
  InsuranceVerificationResponse
} from '../../entities/InsuranceInfo';

/**
 * Interface for insurance verification service
 */
export interface InsuranceVerificationService {
  /**
   * Verify insurance coverage and eligibility
   */
  verifyInsurance(request: VerifyInsuranceRequest): Promise<InsuranceVerificationResponse>;
  
  /**
   * Process insurance card images to extract information
   */
  processInsuranceCard(
    frontImageUrl: string, 
    backImageUrl?: string
  ): Promise<Partial<InsuranceInfo>>;
  
  /**
   * Check if a service is covered by insurance
   */
  checkServiceCoverage(
    insuranceId: string,
    serviceType: string,
    procedureCodes?: string[],
    diagnosisCodes?: string[]
  ): Promise<{
    covered: boolean;
    requiresAuthorization: boolean;
    copay?: number;
    coinsurance?: number;
    message?: string;
  }>;
  
  /**
   * Estimate patient responsibility for a service
   */
  estimatePatientResponsibility(
    insuranceId: string,
    serviceType: string,
    estimatedAmount: number,
    procedureCodes?: string[],
    diagnosisCodes?: string[]
  ): Promise<{
    estimatedPatientResponsibility: number;
    estimatedInsurancePayment: number;
    details: Record<string, any>;
  }>;
  
  /**
   * Check if a provider is in-network
   */
  checkProviderNetwork(
    insuranceId: string,
    providerNpi: string
  ): Promise<{
    inNetwork: boolean;
    tierLevel?: string;
    message?: string;
  }>;
  
  /**
   * Refresh insurance verification for a patient
   */
  refreshVerification(insuranceId: string): Promise<InsuranceVerificationResponse>;
}