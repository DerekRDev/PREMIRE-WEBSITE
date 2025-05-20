import { PatientIntake } from '../../entities/PatientIntake';
import { ConsentForm } from '../../entities/ConsentForm';
import { InsuranceInfo } from '../../entities/InsuranceInfo';
import { MedicalHistory } from '../../entities/MedicalHistory';

/**
 * Repository interface for managing patient intake data
 */
export interface IntakeRepository {
  /**
   * Get patient intake by ID
   */
  getById(id: string): Promise<PatientIntake | null>;
  
  /**
   * Get patient intake by patient ID
   */
  getByPatientId(patientId: string): Promise<PatientIntake | null>;
  
  /**
   * Get patient intake by appointment ID
   */
  getByAppointmentId(appointmentId: string): Promise<PatientIntake | null>;
  
  /**
   * Create a new patient intake
   */
  create(intake: Omit<PatientIntake, 'id' | 'createdAt' | 'lastUpdatedAt'>): Promise<PatientIntake>;
  
  /**
   * Update an existing patient intake
   */
  update(id: string, intake: Partial<PatientIntake>): Promise<PatientIntake>;
  
  /**
   * Save patient demographics information
   */
  saveDemographics(intakeId: string, demographics: PatientIntake['demographics']): Promise<PatientIntake>;
  
  /**
   * Save patient insurance information
   */
  saveInsurance(intakeId: string, insurance: InsuranceInfo[]): Promise<PatientIntake>;
  
  /**
   * Save patient medical history
   */
  saveMedicalHistory(intakeId: string, medicalHistory: MedicalHistory): Promise<PatientIntake>;
  
  /**
   * Save patient consent forms
   */
  saveConsentForms(intakeId: string, consentForms: ConsentForm[]): Promise<PatientIntake>;
  
  /**
   * Complete patient intake
   */
  complete(id: string): Promise<PatientIntake>;
  
  /**
   * Get all required consent forms
   */
  getRequiredConsentForms(): Promise<ConsentForm[]>;
  
  /**
   * Delete a patient intake
   */
  delete(id: string): Promise<void>;
}