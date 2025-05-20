import { useState, useCallback } from 'react';
import { Patient } from '../../core/entities/Patient';

export interface RegisterPatientParams {
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

interface UsePatientResult {
  loading: boolean;
  error: Error | null;
  patient: Patient | null;
  registerPatient: (params: RegisterPatientParams) => Promise<Patient>;
  updatePatient: (patientId: string, params: Partial<RegisterPatientParams>) => Promise<Patient>;
  getPatient: (patientId: string) => Promise<Patient | null>;
}

export const usePatient = (): UsePatientResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);

  // Register a new patient
  const registerPatient = useCallback(async (
    params: RegisterPatientParams
  ): Promise<Patient> => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, we'd call an API that uses the RegisterPatient usecase
      // For now, we'll simulate a response
      
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPatient: Patient = {
        id: `patient-${Date.now()}`,
        firstName: params.firstName,
        lastName: params.lastName,
        middleName: params.middleName,
        dateOfBirth: params.dateOfBirth,
        gender: params.gender,
        address1: params.address1,
        address2: params.address2,
        city: params.city,
        state: params.state,
        zipCode: params.zipCode,
        phone: params.phone,
        email: params.email,
        preferredContactMethod: params.preferredContactMethod,
        emergencyContact: params.emergencyContact,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setPatient(newPatient);
      return newPatient;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to register patient');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing patient
  const updatePatient = useCallback(async (
    patientId: string,
    params: Partial<RegisterPatientParams>
  ): Promise<Patient> => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, we'd call an API to update the patient
      // For now, we'll simulate a response
      
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if we have the current patient in state
      if (patient && patient.id === patientId) {
        const updatedPatient: Patient = {
          ...patient,
          ...params,
          updatedAt: new Date()
        };
        
        setPatient(updatedPatient);
        return updatedPatient;
      } else {
        // Simulate fetching the patient first, then updating
        const fetchedPatient = await getPatient(patientId);
        if (!fetchedPatient) {
          throw new Error(`Patient with ID ${patientId} not found`);
        }
        
        const updatedPatient: Patient = {
          ...fetchedPatient,
          ...params,
          updatedAt: new Date()
        };
        
        setPatient(updatedPatient);
        return updatedPatient;
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update patient');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [patient]);

  // Get a patient by ID
  const getPatient = useCallback(async (
    patientId: string
  ): Promise<Patient | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, we'd call an API to get the patient
      // For now, we'll simulate a response
      
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If we already have this patient in state, return it
      if (patient && patient.id === patientId) {
        return patient;
      }
      
      // Otherwise, create a mock patient
      const mockPatient: Patient = {
        id: patientId,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1980-01-01',
        gender: 'male',
        address1: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        phone: '(555) 123-4567',
        email: 'john.doe@example.com',
        preferredContactMethod: 'email',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setPatient(mockPatient);
      return mockPatient;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get patient');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [patient]);

  return {
    loading,
    error,
    patient,
    registerPatient,
    updatePatient,
    getPatient
  };
};