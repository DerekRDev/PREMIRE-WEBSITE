import { PatientIntake, IntakeStatus } from '../../entities/PatientIntake';
import { IntakeRepository } from '../../interfaces/repositories/IntakeRepository';
import { PatientRepository } from '../../interfaces/repositories/PatientRepository';

export class CompleteIntakeForm {
  constructor(
    private intakeRepository: IntakeRepository,
    private patientRepository: PatientRepository
  ) {}

  /**
   * Complete a patient intake form
   */
  async execute(intakeId: string): Promise<PatientIntake> {
    // Get the intake form
    const intake = await this.intakeRepository.getById(intakeId);
    if (!intake) {
      throw new Error(`Intake with id ${intakeId} not found`);
    }

    // Check if the intake form is already completed
    if (intake.status === 'COMPLETED') {
      return intake;
    }

    // Check if the required fields are filled
    this.validateIntake(intake);

    // Update the patient information if necessary
    if (intake.patientId) {
      await this.updatePatientInfo(intake);
    }

    // Complete the intake
    const completedIntake = await this.intakeRepository.complete(intakeId);
    return completedIntake;
  }

  /**
   * Validate that the intake has all required fields
   */
  private validateIntake(intake: PatientIntake): void {
    // Check demographics
    const demographics = intake.demographics;
    if (!demographics.firstName || !demographics.lastName || !demographics.dateOfBirth || 
        !demographics.address1 || !demographics.city || !demographics.state || 
        !demographics.zipCode || !demographics.phone || !demographics.email) {
      throw new Error('Demographics information is incomplete');
    }

    // Check insurance information (at least one primary insurance is required)
    if (!intake.insurance.some(insurance => insurance.isPrimary)) {
      throw new Error('Primary insurance information is required');
    }

    // Check consent forms (all required forms must be signed)
    const unsignedRequiredForms = intake.consentForms.filter(
      form => form.requiredForIntake && !form.signedAt
    );
    if (unsignedRequiredForms.length > 0) {
      throw new Error('All required consent forms must be signed');
    }
  }

  /**
   * Update patient information from the intake data
   */
  private async updatePatientInfo(intake: PatientIntake): Promise<void> {
    const patient = await this.patientRepository.getById(intake.patientId);
    if (!patient) {
      return;
    }

    // Update patient with demographics information
    const demographics = intake.demographics;
    await this.patientRepository.update(intake.patientId, {
      firstName: demographics.firstName,
      lastName: demographics.lastName,
      dateOfBirth: demographics.dateOfBirth,
      email: demographics.email,
      phone: demographics.phone,
      address: {
        line1: demographics.address1,
        line2: demographics.address2 || '',
        city: demographics.city,
        state: demographics.state,
        postalCode: demographics.zipCode
      }
    });
  }
}
