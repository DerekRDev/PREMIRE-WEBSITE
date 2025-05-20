import { ConsentForm } from '../../entities/ConsentForm';
import { PatientIntake } from '../../entities/PatientIntake';
import { IntakeRepository } from '../../interfaces/repositories/IntakeRepository';

export class ProcessConsent {
  constructor(
    private intakeRepository: IntakeRepository
  ) {}

  /**
   * Get all required consent forms for an intake
   */
  async getRequiredForms(): Promise<ConsentForm[]> {
    return this.intakeRepository.getRequiredConsentForms();
  }

  /**
   * Sign a consent form for a patient intake
   */
  async signForm(params: {
    intakeId: string;
    formId: string;
    signature: string;
    ipAddress: string;
  }): Promise<PatientIntake> {
    const { intakeId, formId, signature, ipAddress } = params;

    // Get the intake
    const intake = await this.intakeRepository.getById(intakeId);
    if (!intake) {
      throw new Error(`Intake with id ${intakeId} not found`);
    }

    // Find the consent form
    const formIndex = intake.consentForms.findIndex(form => form.id === formId);
    if (formIndex === -1) {
      // The form doesn't exist in the intake yet, fetch it from the repository
      const requiredForms = await this.intakeRepository.getRequiredConsentForms();
      const form = requiredForms.find(form => form.id === formId);
      
      if (!form) {
        throw new Error(`Consent form with id ${formId} not found`);
      }

      // Add the form to the intake
      const signedForm: ConsentForm = {
        ...form,
        signedAt: new Date(),
        signature,
        ipAddress
      };

      intake.consentForms.push(signedForm);
    } else {
      // Update the existing form
      intake.consentForms[formIndex] = {
        ...intake.consentForms[formIndex],
        signedAt: new Date(),
        signature,
        ipAddress
      };
    }

    // Save the updated consent forms
    return this.intakeRepository.saveConsentForms(intakeId, intake.consentForms);
  }

  /**
   * Check if all required forms have been signed
   */
  async checkRequiredFormsStatus(intakeId: string): Promise<{
    allSigned: boolean;
    missingForms: string[];
  }> {
    // Get the intake
    const intake = await this.intakeRepository.getById(intakeId);
    if (!intake) {
      throw new Error(`Intake with id ${intakeId} not found`);
    }

    // Get all required forms
    const requiredForms = await this.intakeRepository.getRequiredConsentForms();
    
    // Check which forms are missing or unsigned
    const missingForms: string[] = [];
    
    for (const requiredForm of requiredForms) {
      const formInIntake = intake.consentForms.find(form => form.id === requiredForm.id);
      
      if (!formInIntake || !formInIntake.signedAt) {
        missingForms.push(requiredForm.id);
      }
    }

    return {
      allSigned: missingForms.length === 0,
      missingForms
    };
  }
}
