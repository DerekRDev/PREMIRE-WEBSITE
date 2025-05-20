import React, { useState } from 'react';
import { PatientDemographics } from '@/core/entities/PatientIntake';
import { Button } from '@/ui/design-system/components/Button';
import { Input } from '@/ui/design-system/components/Input';
import { Select } from '@/ui/design-system/components/Select';
import { Card } from '@/ui/design-system/components/Card';

interface DemographicsFormProps {
  data: PatientDemographics;
  onChange: (data: PatientDemographics) => void;
  onNext: () => void;
  onBack?: () => void;
  isLoading?: boolean;
}

// List of US states
const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

export const DemographicsForm: React.FC<DemographicsFormProps> = ({
  data,
  onChange,
  onNext,
  onBack,
  isLoading = false,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof PatientDemographics, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });

    // Clear error when field is updated
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    onChange({
      ...data,
      emergencyContact: {
        ...data.emergencyContact || { name: '', relationship: '', phone: '' },
        [field]: value,
      },
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!data.firstName) newErrors.firstName = 'First name is required';
    if (!data.lastName) newErrors.lastName = 'Last name is required';
    if (!data.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!data.gender) newErrors.gender = 'Gender is required';
    if (!data.address1) newErrors.address1 = 'Address is required';
    if (!data.city) newErrors.city = 'City is required';
    if (!data.state) newErrors.state = 'State is required';
    if (!data.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!data.phone) newErrors.phone = 'Phone number is required';
    if (!data.email) newErrors.email = 'Email is required';
    if (!data.preferredContactMethod) newErrors.preferredContactMethod = 'Preferred contact method is required';

    // Format validations
    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (data.phone && !/^\(\d{3}\) \d{3}-\d{4}$/.test(data.phone)) {
      newErrors.phone = 'Please enter a valid phone number in format (XXX) XXX-XXXX';
    }

    if (data.zipCode && !/^\d{5}(-\d{4})?$/.test(data.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code (XXXXX or XXXXX-XXXX)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const formatPhoneNumber = (value: string): string => {
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

  const handlePhoneChange = (field: 'phone' | 'emergencyContactPhone', value: string) => {
    const formattedPhone = formatPhoneNumber(value);
    
    if (field === 'phone') {
      handleChange('phone', formattedPhone);
    } else {
      handleEmergencyContactChange('phone', formattedPhone);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Personal Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Name fields */}
          <div>
            <Input
              label="First Name *"
              value={data.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              error={!!errors.firstName}
              errorMessage={errors.firstName}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div>
            <Input
              label="Last Name *"
              value={data.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              error={!!errors.lastName}
              errorMessage={errors.lastName}
              placeholder="Enter your last name"
              required
            />
          </div>
          <div>
            <Input
              label="Middle Name (optional)"
              value={data.middleName || ''}
              onChange={(e) => handleChange('middleName', e.target.value)}
              placeholder="Enter your middle name"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <Input
              label="Date of Birth *"
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              error={!!errors.dateOfBirth}
              errorMessage={errors.dateOfBirth}
              required
            />
          </div>

          {/* Gender */}
          <div>
            <Select
              label="Gender *"
              value={data.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              error={errors.gender}
              required
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
                { value: 'prefer-not-to-say', label: 'Prefer not to say' },
              ]}
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Contact information */}
          <div>
            <Input
              label="Email *"
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={!!errors.email}
              errorMessage={errors.email}
              placeholder="email@example.com"
              required
            />
          </div>
          <div>
            <Input
              label="Phone Number *"
              value={data.phone}
              onChange={(e) => handlePhoneChange('phone', e.target.value)}
              error={!!errors.phone}
              errorMessage={errors.phone}
              placeholder="(XXX) XXX-XXXX"
              required
            />
          </div>
          <div>
            <Select
              label="Preferred Contact Method *"
              value={data.preferredContactMethod}
              onChange={(e) => handleChange('preferredContactMethod', e.target.value)}
              error={errors.preferredContactMethod}
              required
              options={[
                { value: 'email', label: 'Email' },
                { value: 'phone', label: 'Phone' },
                { value: 'sms', label: 'SMS' },
              ]}
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Address fields */}
          <div className="md:col-span-2">
            <Input
              label="Address Line 1 *"
              value={data.address1}
              onChange={(e) => handleChange('address1', e.target.value)}
              error={!!errors.address1}
              errorMessage={errors.address1}
              placeholder="Street address"
              required
            />
          </div>
          <div className="md:col-span-2">
            <Input
              label="Address Line 2 (optional)"
              value={data.address2 || ''}
              onChange={(e) => handleChange('address2', e.target.value)}
              placeholder="Apartment, suite, unit, etc."
            />
          </div>
          <div>
            <Input
              label="City *"
              value={data.city}
              onChange={(e) => handleChange('city', e.target.value)}
              error={!!errors.city}
              errorMessage={errors.city}
              placeholder="City"
              required
            />
          </div>
          <div>
            <Select
              label="State *"
              value={data.state}
              onChange={(e) => handleChange('state', e.target.value)}
              error={errors.state}
              required
              options={US_STATES}
            />
          </div>
          <div>
            <Input
              label="ZIP Code *"
              value={data.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              error={!!errors.zipCode}
              errorMessage={errors.zipCode}
              placeholder="XXXXX"
              required
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">Emergency Contact (optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Emergency contact */}
          <div>
            <Input
              label="Name"
              value={data.emergencyContact?.name || ''}
              onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
              placeholder="Emergency contact name"
            />
          </div>
          <div>
            <Input
              label="Relationship"
              value={data.emergencyContact?.relationship || ''}
              onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
              placeholder="E.g., Spouse, Parent, Friend"
            />
          </div>
          <div>
            <Input
              label="Phone Number"
              value={data.emergencyContact?.phone || ''}
              onChange={(e) => handlePhoneChange('emergencyContactPhone', e.target.value)}
              placeholder="(XXX) XXX-XXXX"
            />
          </div>
        </div>

        <div className="flex justify-between">
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              disabled={isLoading}
              type="button"
            >
              Back
            </Button>
          )}
          <Button
            variant="primary"
            type="submit"
            disabled={isLoading}
            className={!onBack ? 'ml-auto' : ''}
          >
            {isLoading ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </form>
    </Card>
  );
};