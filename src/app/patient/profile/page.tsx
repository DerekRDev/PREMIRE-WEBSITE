'use client';

import { useState, useEffect } from 'react';
import { usePatient } from '@/ui/hooks';
import { PatientProfile } from '@/ui/components/patient';
import { PatientRegistrationFormData } from '@/ui/components/patient/PatientRegistrationForm';

export default function PatientProfilePage() {
  const { patient, getPatient, updatePatient, loading, error } = usePatient();
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch patient data on initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we'd get the patient ID from authentication
        // For now, use a mock ID
        const patientId = 'patient-123';
        await getPatient(patientId);
      } catch (err) {
        console.error('Failed to fetch patient data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [getPatient]);

  // Handle patient profile update
  const handleUpdatePatient = async (patientId: string, data: Partial<PatientRegistrationFormData>) => {
    try {
      return await updatePatient(patientId, data);
    } catch (err) {
      console.error('Failed to update patient profile:', err);
      throw err;
    }
  };

  if (isLoading || loading || !patient) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <span className="ml-4 text-neutral-600">Loading patient profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-800 mb-6">
        Patient Profile
      </h1>
      
      <PatientProfile
        patient={patient}
        onUpdate={handleUpdatePatient}
        isLoading={loading}
        error={error?.message}
        className="mx-auto max-w-4xl"
      />
    </div>
  );
}