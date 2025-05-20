import {
  InsuranceInfo,
  VerifyInsuranceRequest,
  InsuranceVerificationResponse
} from '../../core/entities/InsuranceInfo';

import { InsuranceVerificationService } from '../../core/interfaces/services/InsuranceVerificationService';

/**
 * Implementation of the Insurance Verification Service
 * In a real application, this would connect to external eligibility APIs
 */
export class InsuranceVerificationServiceImpl implements InsuranceVerificationService {
  // Mock insurance provider details for demo purposes
  private insuranceProviders = {
    'Blue Cross Blue Shield': {
      inNetwork: true,
      hasCopays: true,
      baseCoinsurance: 20, // 20%
      eligibilityDelayMs: 2000 // Simulated delay
    },
    'Aetna': {
      inNetwork: true,
      hasCopays: true,
      baseCoinsurance: 15,
      eligibilityDelayMs: 1500
    },
    'UnitedHealthcare': {
      inNetwork: true,
      hasCopays: true,
      baseCoinsurance: 20,
      eligibilityDelayMs: 2500
    },
    'Cigna': {
      inNetwork: true,
      hasCopays: true,
      baseCoinsurance: 20,
      eligibilityDelayMs: 1800
    },
    'Humana': {
      inNetwork: false, // Example of out-of-network
      hasCopays: false,
      baseCoinsurance: 40,
      eligibilityDelayMs: 2200
    },
    'Medicare': {
      inNetwork: true,
      hasCopays: true,
      baseCoinsurance: 20,
      eligibilityDelayMs: 3000
    },
    'Medicaid': {
      inNetwork: true,
      hasCopays: false,
      baseCoinsurance: 0,
      eligibilityDelayMs: 2700
    }
  };

  // Mock copay amounts by service type
  private mockCopays = {
    primaryCare: 30,
    specialist: 50,
    emergency: 250,
    urgent: 75
  };

  // Map of insuranceId to insurance info (simulating a database)
  private insuranceMap: Record<string, InsuranceInfo> = {};

  constructor() {
    // Initialize with some sample data
    const sampleInsurance: InsuranceInfo = {
      id: 'ins-bcbs-123',
      provider: 'Blue Cross Blue Shield',
      planName: 'PPO 80/20',
      planType: 'PPO',
      memberId: 'XYZ123456789',
      groupNumber: 'G9876543',
      subscriberName: 'John Doe',
      subscriberDob: '1980-01-15',
      relationship: 'self',
      isPrimary: true,
      verificationStatus: 'VERIFIED',
      cardFrontImageUrl: 'https://example.com/card-front.jpg',
      cardBackImageUrl: 'https://example.com/card-back.jpg',
      effectiveDate: new Date('2023-01-01'),
      copay: {
        primaryCare: 30,
        specialist: 50,
        emergency: 250,
        urgent: 75
      },
      coinsurance: 20,
      deductible: {
        individual: 1500,
        family: 3000,
        remaining: 750
      },
      outOfPocketMax: {
        individual: 5000,
        family: 10000,
        remaining: 3000
      },
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      lastVerifiedAt: new Date('2023-01-01')
    };
    
    this.insuranceMap[sampleInsurance.id] = sampleInsurance;
  }

  /**
   * Verify insurance coverage and eligibility
   */
  async verifyInsurance(request: VerifyInsuranceRequest): Promise<InsuranceVerificationResponse> {
    const insurance = this.insuranceMap[request.insuranceId];
    
    if (!insurance) {
      return {
        verified: false,
        status: 'FAILED',
        message: 'Insurance not found',
        timestamp: new Date()
      };
    }
    
    // Get provider settings or use defaults
    const providerSettings = this.insuranceProviders[insurance.provider] || {
      inNetwork: true,
      hasCopays: true,
      baseCoinsurance: 20,
      eligibilityDelayMs: 2000
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, providerSettings.eligibilityDelayMs));
    
    // 10% chance of verification failure for demo purposes
    if (Math.random() < 0.1) {
      return {
        verified: false,
        status: 'FAILED',
        message: 'Unable to connect to insurance eligibility service',
        timestamp: new Date()
      };
    }
    
    // Construct response
    const response: InsuranceVerificationResponse = {
      verified: true,
      status: 'VERIFIED',
      eligibility: {
        isEligible: true,
        inNetwork: providerSettings.inNetwork,
        effectiveDate: insurance.effectiveDate,
        expirationDate: insurance.expirationDate,
        planDetails: {
          planName: insurance.planName,
          planType: insurance.planType
        }
      },
      benefits: {
        covered: true,
        copay: providerSettings.hasCopays ? this.mockCopays.specialist : undefined,
        coinsurance: providerSettings.baseCoinsurance,
        deductible: {
          amount: insurance.deductible?.individual || 1500,
          remaining: insurance.deductible?.remaining || 750,
          satisfied: (insurance.deductible?.remaining || 0) === 0
        },
        outOfPocketMax: {
          amount: insurance.outOfPocketMax?.individual || 5000,
          remaining: insurance.outOfPocketMax?.remaining || 3000,
          satisfied: (insurance.outOfPocketMax?.remaining || 0) === 0
        }
      },
      timestamp: new Date()
    };
    
    // If service type and amount are provided, estimate patient responsibility
    if (request.serviceType && request.estimatedAmount) {
      const estimateResult = await this.estimatePatientResponsibility(
        request.insuranceId,
        request.serviceType,
        request.estimatedAmount,
        request.procedureCodes,
        request.diagnosisCodes
      );
      
      response.estimatedPatientResponsibility = estimateResult.estimatedPatientResponsibility;
      response.estimatedInsurancePayment = estimateResult.estimatedInsurancePayment;
    }
    
    return response;
  }

  /**
   * Process insurance card images to extract information
   * (In a real app, this would use OCR to extract info from card images)
   */
  async processInsuranceCard(
    frontImageUrl: string,
    backImageUrl?: string
  ): Promise<Partial<InsuranceInfo>> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In a real app, this would use OCR to extract card info
    // For this demo, we'll return mock data
    return {
      provider: 'Blue Cross Blue Shield',
      planName: 'PPO 80/20',
      memberId: 'XYZ123456789',
      groupNumber: 'G9876543',
      cardFrontImageUrl: frontImageUrl,
      cardBackImageUrl: backImageUrl
    };
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
    const insurance = this.insuranceMap[insuranceId];
    
    if (!insurance) {
      return {
        covered: false,
        requiresAuthorization: false,
        message: 'Insurance not found'
      };
    }
    
    // Get provider settings
    const providerSettings = this.insuranceProviders[insurance.provider] || {
      inNetwork: true,
      hasCopays: true,
      baseCoinsurance: 20
    };
    
    // Determine if authorization is required (for demo, only certain procedures)
    const requiresAuthorization = procedureCodes?.some(code => 
      ['99214', '99215', 'J1071', '27130'].includes(code)
    ) || false;
    
    // Determine copay based on service type
    let copay: number | undefined;
    if (providerSettings.hasCopays) {
      if (serviceType === 'PRIMARY_CARE') {
        copay = this.mockCopays.primaryCare;
      } else if (serviceType === 'SPECIALIST') {
        copay = this.mockCopays.specialist;
      } else if (serviceType === 'EMERGENCY') {
        copay = this.mockCopays.emergency;
      } else if (serviceType === 'URGENT') {
        copay = this.mockCopays.urgent;
      }
    }
    
    return {
      covered: true, // Assume covered for demo
      requiresAuthorization,
      copay,
      coinsurance: providerSettings.baseCoinsurance,
      message: requiresAuthorization 
        ? 'This service requires prior authorization'
        : 'Service is covered by insurance'
    };
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
    const insurance = this.insuranceMap[insuranceId];
    
    if (!insurance) {
      return {
        estimatedPatientResponsibility: estimatedAmount,
        estimatedInsurancePayment: 0,
        details: { error: 'Insurance not found' }
      };
    }
    
    // Get provider settings
    const providerSettings = this.insuranceProviders[insurance.provider] || {
      inNetwork: true,
      hasCopays: true,
      baseCoinsurance: 20
    };
    
    // Get coverage details
    const coverageCheck = await this.checkServiceCoverage(
      insuranceId, 
      serviceType, 
      procedureCodes, 
      diagnosisCodes
    );
    
    const deductibleRemaining = insurance.deductible?.remaining || 0;
    
    // Calculate patient responsibility
    let patientResponsibility = 0;
    let insurancePayment = 0;
    
    // If not covered, patient pays full amount
    if (!coverageCheck.covered) {
      patientResponsibility = estimatedAmount;
      insurancePayment = 0;
    } else {
      // If there's a copay, that's the patient's responsibility
      if (coverageCheck.copay !== undefined) {
        patientResponsibility = coverageCheck.copay;
        insurancePayment = estimatedAmount - patientResponsibility;
      } else {
        // Otherwise apply deductible and coinsurance
        
        // First apply deductible
        if (deductibleRemaining > 0) {
          const deductibleApplied = Math.min(deductibleRemaining, estimatedAmount);
          patientResponsibility += deductibleApplied;
          
          // Remaining amount after deductible
          const remainingAmount = estimatedAmount - deductibleApplied;
          
          if (remainingAmount > 0 && coverageCheck.coinsurance !== undefined) {
            // Apply coinsurance to the remaining amount
            const coinsuranceAmount = (remainingAmount * coverageCheck.coinsurance) / 100;
            patientResponsibility += coinsuranceAmount;
            insurancePayment = remainingAmount - coinsuranceAmount;
          }
        } else {
          // Deductible already met, just apply coinsurance
          if (coverageCheck.coinsurance !== undefined) {
            const coinsuranceAmount = (estimatedAmount * coverageCheck.coinsurance) / 100;
            patientResponsibility = coinsuranceAmount;
            insurancePayment = estimatedAmount - coinsuranceAmount;
          }
        }
      }
    }
    
    return {
      estimatedPatientResponsibility: patientResponsibility,
      estimatedInsurancePayment: insurancePayment,
      details: {
        covered: coverageCheck.covered,
        requiresAuthorization: coverageCheck.requiresAuthorization,
        copay: coverageCheck.copay,
        coinsurance: coverageCheck.coinsurance,
        deductibleRemaining,
        outOfPocketRemaining: insurance.outOfPocketMax?.remaining || 0
      }
    };
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
    const insurance = this.insuranceMap[insuranceId];
    
    if (!insurance) {
      return {
        inNetwork: false,
        message: 'Insurance not found'
      };
    }
    
    // Get provider settings
    const providerSettings = this.insuranceProviders[insurance.provider] || {
      inNetwork: true
    };
    
    return {
      inNetwork: providerSettings.inNetwork,
      tierLevel: providerSettings.inNetwork ? 'Preferred' : undefined,
      message: providerSettings.inNetwork
        ? 'Provider is in-network'
        : 'Provider is out-of-network'
    };
  }

  /**
   * Refresh insurance verification for a patient
   */
  async refreshVerification(insuranceId: string): Promise<InsuranceVerificationResponse> {
    // Simply re-verify the insurance
    return this.verifyInsurance({ insuranceId });
  }
}