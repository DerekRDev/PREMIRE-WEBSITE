export interface Patient {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
}