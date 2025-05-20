/**
 * Consent form for a patient
 */
export interface ConsentForm {
  id: string;
  name: string;
  version: string;
  content: string;
  signedAt?: Date;
  signature?: string;
  ipAddress?: string;
  requiredForIntake: boolean;
  createdAt: Date;
  updatedAt: Date;
}
