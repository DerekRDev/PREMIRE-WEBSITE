import { PatientDemographics } from '@/core/entities/PatientIntake';
import { InsuranceInfo } from '@/core/entities/InsuranceInfo';
import { MedicalHistory } from '@/core/entities/MedicalHistory';
import { ConsentForm } from '@/core/entities/ConsentForm';

/**
 * Validates patient demographics information
 */
export const validateDemographics = (
  demographics: PatientDemographics
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Required fields
  if (!demographics.firstName) errors.firstName = 'First name is required';
  if (!demographics.lastName) errors.lastName = 'Last name is required';
  if (!demographics.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
  if (!demographics.gender) errors.gender = 'Gender is required';
  if (!demographics.address1) errors.address1 = 'Address is required';
  if (!demographics.city) errors.city = 'City is required';
  if (!demographics.state) errors.state = 'State is required';
  if (!demographics.zipCode) errors.zipCode = 'ZIP code is required';
  if (!demographics.phone) errors.phone = 'Phone number is required';
  if (!demographics.email) errors.email = 'Email is required';
  if (!demographics.preferredContactMethod) errors.preferredContactMethod = 'Preferred contact method is required';

  // Format validations
  if (demographics.email && !/^\S+@\S+\.\S+$/.test(demographics.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (demographics.phone && !/^\(\d{3}\) \d{3}-\d{4}$/.test(demographics.phone)) {
    errors.phone = 'Please enter a valid phone number in format (XXX) XXX-XXXX';
  }

  if (demographics.zipCode && !/^\d{5}(-\d{4})?$/.test(demographics.zipCode)) {
    errors.zipCode = 'Please enter a valid ZIP code (XXXXX or XXXXX-XXXX)';
  }

  // Emergency contact validation
  if (
    demographics.emergencyContact && 
    demographics.emergencyContact.phone && 
    !/^\(\d{3}\) \d{3}-\d{4}$/.test(demographics.emergencyContact.phone)
  ) {
    errors.emergencyContactPhone = 'Please enter a valid phone number in format (XXX) XXX-XXXX';
  }

  return errors;
};

/**
 * Validates insurance information
 */
export const validateInsurance = (
  insuranceInfo: InsuranceInfo[]
): Record<string, Record<string, string>> => {
  const errors: Record<string, Record<string, string>> = {};

  // Check if there's at least one insurance
  if (insuranceInfo.length === 0) {
    errors[-1] = { general: 'At least one insurance is required' };
    return errors;
  }

  // Check if there's at least one primary insurance
  if (!insuranceInfo.some(insurance => insurance.isPrimary)) {
    errors[0] = { ...errors[0] || {}, isPrimary: 'At least one insurance must be marked as primary' };
  }

  insuranceInfo.forEach((insurance, index) => {
    errors[index] = { ...errors[index] || {} };

    // Required fields
    if (!insurance.provider) errors[index].provider = 'Insurance provider is required';
    if (!insurance.memberId) errors[index].memberId = 'Member ID is required';

    // If not self, subscriber info is required
    if (insurance.relationship && insurance.relationship !== 'self') {
      if (!insurance.subscriberName) {
        errors[index].subscriberName = 'Subscriber name is required';
      }
      if (!insurance.subscriberDob) {
        errors[index].subscriberDob = 'Subscriber date of birth is required';
      }
    }
  });

  return errors;
};

/**
 * Validates medical history
 */
export const validateMedicalHistory = (
  medicalHistory: MedicalHistory
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // No strict validation requirements for medical history
  // Users can choose to not provide certain information

  return errors;
};

/**
 * Validates consent forms
 */
export const validateConsentForms = (
  consentForms: ConsentForm[]
): { valid: boolean; unsignedRequiredForms: string[] } => {
  // For debugging
  console.log("Validating consent forms:", consentForms);
  
  // Find all required forms that haven't been signed
  const unsignedRequiredForms = consentForms
    .filter(form => {
      const isRequired = form.requiredForIntake;
      const isSigned = form.signedAt && form.signature;
      console.log(`Form ${form.id} - ${form.name}: required=${isRequired}, signed=${!!isSigned}`);
      return isRequired && !isSigned;
    })
    .map(form => form.id);

  return {
    valid: unsignedRequiredForms.length === 0,
    unsignedRequiredForms
  };
};

/**
 * Formats a phone number to (XXX) XXX-XXXX format
 */
export const formatPhoneNumber = (value: string): string => {
  // Strip all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Format the phone number
  if (digits.length <= 3) {
    return digits.length ? `(${digits}` : '';
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
};

/**
 * Validates a date of birth (must be in the past and not more than 120 years ago)
 */
export const validateDateOfBirth = (dateOfBirth: string): string | null => {
  const date = new Date(dateOfBirth);
  const now = new Date();
  
  if (isNaN(date.getTime())) {
    return 'Please enter a valid date';
  }
  
  if (date > now) {
    return 'Date of birth cannot be in the future';
  }
  
  const maxAge = 120;
  const minDate = new Date();
  minDate.setFullYear(now.getFullYear() - maxAge);
  
  if (date < minDate) {
    return `Date of birth cannot be more than ${maxAge} years ago`;
  }
  
  return null;
};

/**
 * Validates an email address
 */
export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};