import { PatientIntake, IntakeStatus, PatientDemographics } from '../../entities/PatientIntake';
import { IntakeRepository } from '../../interfaces/repositories/IntakeRepository';
import { PatientRepository } from '../../interfaces/repositories/PatientRepository';

export class StartPatientIntake {
  constructor(
    private intakeRepository: IntakeRepository,
    private patientRepository: PatientRepository
  ) {}

  /**
   * Start a new patient intake process
   */
  async execute(params: { 
    patientId?: string; 
    appointmentId?: string;
    demographics?: PatientDemographics;
  }): Promise<PatientIntake> {
    const { patientId, appointmentId, demographics } = params;
    
    // Check if the patient exists if patientId is provided
    if (patientId) {
      const patient = await this.patientRepository.getById(patientId);
      if (!patient) {
        throw new Error(`Patient with id ${patientId} not found`);
      }
    }

    // Check if there's an existing intake for the patient or appointment
    let existingIntake: PatientIntake | null = null;
    
    if (patientId) {
      existingIntake = await this.intakeRepository.getByPatientId(patientId);
    } else if (appointmentId) {
      existingIntake = await this.intakeRepository.getByAppointmentId(appointmentId);
    }

    // If there's an existing intake that's not completed, return it
    if (existingIntake && existingIntake.status !== 'COMPLETED' && existingIntake.status !== 'EXPIRED') {
      return existingIntake;
    }

    // Create a new patient intake
    const newIntake: Omit<PatientIntake, 'id' | 'createdAt' | 'lastUpdatedAt'> = {
      patientId: patientId || '',
      appointmentId,
      status: 'NOT_STARTED',
      demographics: demographics || {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'prefer-not-to-say',
        address1: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        email: '',
        preferredContactMethod: 'email'
      },
      insurance: [],
      medicalHistory: {
        id: '',
        patientId: patientId || '',
        allergies: {
          hasAllergies: false,
          items: []
        },
        medications: [],
        conditions: [],
        surgeries: [],
        familyHistory: {},
        socialHistory: {
          smokingStatus: 'never',
          alcoholUse: 'none',
          exerciseFrequency: 'none'
        },
        lastUpdatedAt: new Date(),
        createdAt: new Date()
      },
      consentForms: [],
      paymentRequired: false
    };

    const createdIntake = await this.intakeRepository.create(newIntake);
    return createdIntake;
  }
}
