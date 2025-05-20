import React, { useState } from 'react';
import { Card } from '../../design-system/components/Card';
import { Input } from '../../design-system/components/Input';
import { Button } from '../../design-system/components/Button';
import { Select } from '../../design-system/components/Select';

export interface PatientRegistrationFormData {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
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

export interface PatientRegistrationFormProps {
  onSubmit: (data: PatientRegistrationFormData) => void;
  initialData?: Partial<PatientRegistrationFormData>;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

export const PatientRegistrationForm: React.FC<PatientRegistrationFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
  error,
  className = '',
}) => {
  const [formData, setFormData] = useState<PatientRegistrationFormData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    middleName: initialData?.middleName || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    gender: initialData?.gender || 'prefer-not-to-say',
    address1: initialData?.address1 || '',
    address2: initialData?.address2 || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    preferredContactMethod: initialData?.preferredContactMethod || 'email',
    emergencyContact: initialData?.emergencyContact || {
      name: '',
      relationship: '',
      phone: ''
    },
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested emergency contact fields
    if (name.startsWith('emergency.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        emergencyContact: {
          ...formData.emergencyContact,
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear any error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Validate the form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Required fields
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dateOfBirth)) {
      errors.dateOfBirth = 'Date must be in YYYY-MM-DD format';
    } else {
      // Validate date is not in the future
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      if (dob > today) {
        errors.dateOfBirth = 'Date of birth cannot be in the future';
      }
    }
    
    if (!formData.address1.trim()) {
      errors.address1 = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }
    
    if (!formData.zipCode.trim()) {
      errors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      errors.zipCode = 'Invalid ZIP code format';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9()\-\s+]+$/.test(formData.phone)) {
      errors.phone = 'Invalid phone number format';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    // If emergency contact info is partially filled, ensure all fields are filled
    const emergencyContact = formData.emergencyContact;
    if (
      emergencyContact &&
      (emergencyContact.name || emergencyContact.relationship || emergencyContact.phone)
    ) {
      if (!emergencyContact.name.trim()) {
        errors['emergency.name'] = 'Emergency contact name is required';
      }
      
      if (!emergencyContact.relationship.trim()) {
        errors['emergency.relationship'] = 'Relationship is required';
      }
      
      if (!emergencyContact.phone.trim()) {
        errors['emergency.phone'] = 'Emergency contact phone is required';
      } else if (!/^[0-9()\-\s+]+$/.test(emergencyContact.phone)) {
        errors['emergency.phone'] = 'Invalid phone number format';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // US states for dropdown
  const usStates = [
    { value: '', label: 'Select State' },
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

  return (
    <Card className={`p-6 ${className}`}>
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">
          Patient Registration
        </h2>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-6">
          {/* Personal Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-4">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={formErrors.firstName}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={formErrors.lastName}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="middleName" className="block text-sm font-medium text-neutral-700 mb-1">
                  Middle Name
                </label>
                <Input
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-neutral-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  error={formErrors.dateOfBirth}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-neutral-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <Select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Contact Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-4">
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="address1" className="block text-sm font-medium text-neutral-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <Input
                  id="address1"
                  name="address1"
                  value={formData.address1}
                  onChange={handleChange}
                  placeholder="Street address"
                  error={formErrors.address1}
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="address2" className="block text-sm font-medium text-neutral-700 mb-1">
                  Address Line 2
                </label>
                <Input
                  id="address2"
                  name="address2"
                  value={formData.address2}
                  onChange={handleChange}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={formErrors.city}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <Select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    error={formErrors.state}
                    required
                  >
                    {usStates.map(state => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-neutral-700 mb-1">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    error={formErrors.zipCode}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  error={formErrors.phone}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={formErrors.email}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="preferredContactMethod" className="block text-sm font-medium text-neutral-700 mb-1">
                  Preferred Contact Method <span className="text-red-500">*</span>
                </label>
                <Select
                  id="preferredContactMethod"
                  name="preferredContactMethod"
                  value={formData.preferredContactMethod}
                  onChange={handleChange}
                  required
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="sms">SMS/Text</option>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Emergency Contact Section */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-4">
              Emergency Contact
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="emergency.name" className="block text-sm font-medium text-neutral-700 mb-1">
                  Name
                </label>
                <Input
                  id="emergency.name"
                  name="emergency.name"
                  value={formData.emergencyContact?.name || ''}
                  onChange={handleChange}
                  error={formErrors['emergency.name']}
                />
              </div>
              
              <div>
                <label htmlFor="emergency.relationship" className="block text-sm font-medium text-neutral-700 mb-1">
                  Relationship
                </label>
                <Input
                  id="emergency.relationship"
                  name="emergency.relationship"
                  value={formData.emergencyContact?.relationship || ''}
                  onChange={handleChange}
                  error={formErrors['emergency.relationship']}
                />
              </div>
              
              <div>
                <label htmlFor="emergency.phone" className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone
                </label>
                <Input
                  id="emergency.phone"
                  name="emergency.phone"
                  type="tel"
                  value={formData.emergencyContact?.phone || ''}
                  onChange={handleChange}
                  error={formErrors['emergency.phone']}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-neutral-200">
            <p className="text-sm text-neutral-500 mb-4">
              By submitting this form, you acknowledge that the information provided is accurate and will be used to create your patient profile.
            </p>
            
            <Button
              type="submit"
              variant="primary"
              className="w-full md:w-auto"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Register
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};