import {
  InsuranceInfo,
  VerifyInsuranceRequest,
  InsuranceVerificationResponse
} from '../../entities/InsuranceInfo';

import { InsuranceVerificationService } from '../../interfaces/services/InsuranceVerificationService';

export class VerifyInsuranceUseCase {
  constructor(
    private insuranceVerificationService: InsuranceVerificationService
  ) {}

  /**
   * Verify insurance coverage and eligibility
   */
  async execute(request: VerifyInsuranceRequest): Promise<InsuranceVerificationResponse> {
    return this.insuranceVerificationService.verifyInsurance(request);
  }

  /**
   * Process insurance card images to extract information
   */
  async processInsuranceCard(
    frontImageUrl: string,
    backImageUrl?: string
  ): Promise<Partial<InsuranceInfo>> {
    return this.insuranceVerificationService.processInsuranceCard(frontImageUrl, backImageUrl);
  }

  /**
   * Check if a service is covered by insurance
   */
  async checkServiceCoverage(
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
  }> {
    return this.insuranceVerificationService.checkServiceCoverage(
      insuranceId,
      serviceType,
      procedureCodes,
      diagnosisCodes
    );
  }

  /**
   * Estimate patient responsibility for a service
   */
  async estimatePatientResponsibility(
    insuranceId: string,
    serviceType: string,
    estimatedAmount: number,
    procedureCodes?: string[],
    diagnosisCodes?: string[]
  ): Promise<{
    estimatedPatientResponsibility: number;
    estimatedInsurancePayment: number;
    details: Record<string, any>;
  }> {
    return this.insuranceVerificationService.estimatePatientResponsibility(
      insuranceId,
      serviceType,
      estimatedAmount,
      procedureCodes,
      diagnosisCodes
    );
  }

  /**
   * Check if a provider is in-network
   */
  async checkProviderNetwork(
    insuranceId: string,
    providerNpi: string
  ): Promise<{
    inNetwork: boolean;
    tierLevel?: string;
    message?: string;
  }> {
    return this.insuranceVerificationService.checkProviderNetwork(
      insuranceId,
      providerNpi
    );
  }

  /**
   * Refresh insurance verification for a patient
   */
  async refreshVerification(insuranceId: string): Promise<InsuranceVerificationResponse> {
    return this.insuranceVerificationService.refreshVerification(insuranceId);
  }
}