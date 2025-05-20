import { InsuranceInfo } from '../../entities/InsuranceInfo';
import { PatientIntake } from '../../entities/PatientIntake';
import { IntakeRepository } from '../../interfaces/repositories/IntakeRepository';

// This would typically be provided by an external insurance verification service
interface InsuranceVerificationService {
  verifyInsurance(insuranceInfo: InsuranceInfo): Promise<{
    verified: boolean;
    details: Record<string, any>;
  }>;
}

export class VerifyInsurance {
  constructor(
    private intakeRepository: IntakeRepository,
    private insuranceVerificationService: InsuranceVerificationService
  ) {}

  /**
   * Verify insurance information for a patient intake
   */
  async execute(params: {
    intakeId: string;
    insuranceInfo: InsuranceInfo[];
  }): Promise<{
    verified: boolean;
    updatedInsurance: InsuranceInfo[];
    intake: PatientIntake;
  }> {
    const { intakeId, insuranceInfo } = params;

    // Get the intake form
    const intake = await this.intakeRepository.getById(intakeId);
    if (!intake) {
      throw new Error(`Intake with id ${intakeId} not found`);
    }

    // Verify each insurance
    const updatedInsurance = await Promise.all(
      insuranceInfo.map(async (insurance) => {
        try {
          const verificationResult = await this.insuranceVerificationService.verifyInsurance(insurance);
          
          return {
            ...insurance,
            verificationStatus: verificationResult.verified ? 'verified' : 'failed',
            verificationDetails: verificationResult.details
          };
        } catch (error) {
          console.error('Insurance verification error:', error);
          return {
            ...insurance,
            verificationStatus: 'failed',
            verificationDetails: { error: 'Verification service error' }
          };
        }
      })
    );

    // Update the intake with the verified insurance information
    const updatedIntake = await this.intakeRepository.saveInsurance(intakeId, updatedInsurance);

    // Check if all required insurance information is verified
    const allVerified = updatedInsurance.every(
      insurance => insurance.isPrimary ? insurance.verificationStatus === 'verified' : true
    );

    return {
      verified: allVerified,
      updatedInsurance,
      intake: updatedIntake
    };
  }
}
