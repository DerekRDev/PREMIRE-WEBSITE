import { Patient } from '../../entities/Patient';
import { PatientRepository } from '../../interfaces/repositories/PatientRepository';

export interface RegisterPatientRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string; // ISO format date
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  preferredContactMethod: 'phone' | 'email' | 'sms';
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export class RegisterPatient {
  constructor(
    private readonly patientRepository: PatientRepository
  ) {}

  async execute(request: RegisterPatientRequest): Promise<Patient> {
    const {
      firstName,
      lastName,
      middleName,
      dateOfBirth,
      gender,
      address1,
      address2,
      city,
      state,
      zipCode,
      phone,
      email,
      preferredContactMethod,
      emergencyContact
    } = request;

    // Check if a patient with this email already exists
    const existingPatient = await this.patientRepository.findByEmail(email);
    if (existingPatient) {
      throw new Error(`A patient with email ${email} already exists`);
    }

    // Validate required fields
    this.validatePatientData(request);

    // Create the patient
    const patient = await this.patientRepository.create({
      firstName,
      lastName,
      middleName,
      dateOfBirth,
      gender,
      address1,
      address2,
      city,
      state,
      zipCode,
      phone,
      email,
      preferredContactMethod,
      emergencyContact
    });

    return patient;
  }

  // Validate patient data
  private validatePatientData(data: RegisterPatientRequest): void {
    // Basic validation
    if (!data.firstName || data.firstName.trim() === '') {
      throw new Error('First name is required');
    }

    if (!data.lastName || data.lastName.trim() === '') {
      throw new Error('Last name is required');
    }

    if (!data.dateOfBirth) {
      throw new Error('Date of birth is required');
    }

    // Validate date of birth format (ISO format)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.dateOfBirth)) {
      throw new Error('Date of birth must be in ISO format (YYYY-MM-DD)');
    }

    // Validate date of birth is not in the future
    const dobDate = new Date(data.dateOfBirth);
    const today = new Date();
    if (dobDate > today) {
      throw new Error('Date of birth cannot be in the future');
    }

    // Validate email format
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error('A valid email address is required');
    }

    // Validate phone format (simple check for numeric characters)
    if (!data.phone || !/^[0-9()\-\s+]+$/.test(data.phone)) {
      throw new Error('A valid phone number is required');
    }

    // Validate address
    if (!data.address1 || data.address1.trim() === '') {
      throw new Error('Address is required');
    }

    if (!data.city || data.city.trim() === '') {
      throw new Error('City is required');
    }

    if (!data.state || data.state.trim() === '') {
      throw new Error('State is required');
    }

    if (!data.zipCode || !/^\d{5}(-\d{4})?$/.test(data.zipCode)) {
      throw new Error('A valid US ZIP code is required');
    }

    // Validate emergency contact if provided
    if (data.emergencyContact) {
      if (!data.emergencyContact.name || data.emergencyContact.name.trim() === '') {
        throw new Error('Emergency contact name is required');
      }

      if (!data.emergencyContact.relationship || data.emergencyContact.relationship.trim() === '') {
        throw new Error('Emergency contact relationship is required');
      }

      if (!data.emergencyContact.phone || !/^[0-9()\-\s+]+$/.test(data.emergencyContact.phone)) {
        throw new Error('A valid emergency contact phone number is required');
      }
    }
  }
}