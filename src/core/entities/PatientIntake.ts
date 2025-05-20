import { InsuranceInfo } from './InsuranceInfo';
import { MedicalHistory } from './MedicalHistory';
import { ConsentForm } from './ConsentForm';

/**
 * Status of the patient intake process
 */
export type IntakeStatus = 
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'INSURANCE_VERIFICATION_PENDING'
  | 'PAYMENT_PENDING'
  | 'COMPLETED'
  | 'EXPIRED';

/**
 * Demographics information for a patient
 */
export interface PatientDemographics {
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

/**
 * Payment information for a patient intake
 */
export interface PaymentInfo {
  transactionId: string;
  amount: number;
  paymentMethod: 'CREDIT_CARD' | 'BANK_ACCOUNT' | 'OTHER';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  receiptUrl?: string;
  processedAt?: Date;
}

/**
 * Patient intake form data
 */
export interface PatientIntake {
  id: string;
  patientId: string;
  appointmentId?: string;
  status: IntakeStatus;
  demographics: PatientDemographics;
  insurance: InsuranceInfo[];
  medicalHistory: MedicalHistory;
  consentForms: ConsentForm[];
  paymentInfo?: PaymentInfo;
  paymentRequired: boolean;
  lastSavedStep?: number;
  completedAt?: Date;
  lastUpdatedAt: Date;
  createdAt: Date;
}
