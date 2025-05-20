'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePatient } from '@/ui/hooks';
import { PatientRegistrationForm, PatientRegistrationFormData } from '@/ui/components/patient';

export default function PatientRegistrationPage() {
  const router = useRouter();
  const { registerPatient, loading, error } = usePatient();
  const [registrationError, setRegistrationError] = useState<string | undefined>();
  
  // Handle form submission
  const handleRegister = async (data: PatientRegistrationFormData) => {
    try {
      setRegistrationError(undefined);
      const patient = await registerPatient(data);
      
      // Redirect to patient dashboard after successful registration
      if (patient) {
        router.push('/patient');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setRegistrationError(error?.message || 'An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-800 mb-6">
          Patient Registration
        </h1>
        
        <p className="text-neutral-600 mb-8">
          Please fill out the following information to create your patient account.
          Fields marked with an asterisk (*) are required.
        </p>
        
        <PatientRegistrationForm
          onSubmit={handleRegister}
          isLoading={loading}
          error={registrationError || error?.message}
        />
      </div>
    </div>
  );
}