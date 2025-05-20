'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Referral, ReferralStatus } from '@/core/entities/Referral';
import { Patient } from '@/core/entities/Patient';
import { Provider } from '@/core/entities/Provider';
import { ReferralDetails } from '@/ui/components/referral';

export default function ReferralDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [referral, setReferral] = useState<Referral | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [referringProvider, setReferringProvider] = useState<Provider | null>(null);
  const [receivingProvider, setReceivingProvider] = useState<Provider | null>(null);

  // This is a mock function that would normally fetch data from an API
  useEffect(() => {
    const fetchReferralDetails = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be API calls
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mock referral data based on ID
        if (params.id === 'ref-1') {
          const mockReferral: Referral = {
            id: 'ref-1',
            patientId: 'patient-1',
            createdAt: new Date('2023-10-15'),
            updatedAt: new Date('2023-10-15'),
            status: 'SUBMITTED',
            referringProviderId: 'provider-1',
            receivingProviderId: 'provider-2',
            specialtyType: 'Cardiology',
            reason: 'Patient experiencing chest pains and shortness of breath. Has family history of heart disease and is currently on medication for hypertension. Recent EKG showed some abnormalities that require further evaluation.',
            notes: 'Patient is anxious about heart health due to father passing from heart attack at age 60.',
            urgencyLevel: 'URGENT',
            auditTrail: [
              {
                fromStatus: 'DRAFT',
                toStatus: 'SUBMITTED',
                changedAt: new Date('2023-10-15'),
                changedBy: 'user-1',
                notes: 'Referral submitted by Dr. Smith'
              }
            ]
          };
          
          const mockPatient: Patient = {
            id: 'patient-1',
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1975-08-12',
            gender: 'male',
            email: 'john.doe@example.com',
            phoneNumber: '(555) 123-4567',
            address: {
              street: '123 Main St',
              city: 'Anytown',
              state: 'FL',
              zipCode: '32601'
            }
          };
          
          const mockReferringProvider: Provider = {
            id: 'provider-1',
            firstName: 'Sarah',
            lastName: 'Smith',
            credentials: 'MD',
            specialties: ['Family Medicine', 'Primary Care'],
            npi: '1234567890',
            practiceName: 'Premier Primary Care',
            email: 'dr.smith@premierhealth.com',
            phone: '(555) 987-6543'
          };
          
          const mockReceivingProvider: Provider = {
            id: 'provider-2',
            firstName: 'Michael',
            lastName: 'Johnson',
            credentials: 'MD, FACC',
            specialties: ['Cardiology', 'Interventional Cardiology'],
            npi: '0987654321',
            practiceName: 'Premier Cardiology Specialists',
            email: 'dr.johnson@premierhealth.com',
            phone: '(555) 321-7890'
          };
          
          setReferral(mockReferral);
          setPatient(mockPatient);
          setReferringProvider(mockReferringProvider);
          setReceivingProvider(mockReceivingProvider);
        } else {
          // Default fallback for any other ID
          const mockReferral: Referral = {
            id: params.id,
            patientId: 'patient-default',
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'SUBMITTED',
            referringProviderId: 'provider-default-1',
            receivingProviderId: 'provider-default-2',
            specialtyType: 'General',
            reason: 'General consultation requested',
            urgencyLevel: 'ROUTINE',
            auditTrail: [
              {
                fromStatus: 'DRAFT',
                toStatus: 'SUBMITTED',
                changedAt: new Date(),
                changedBy: 'user-default',
                notes: 'Referral submitted'
              }
            ]
          };
          
          setReferral(mockReferral);
          // Default mock data for patient and providers could be set here
        }
      } catch (error) {
        console.error('Error fetching referral details:', error);
        router.push('/referrals'); // Redirect back to referrals list on error
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReferralDetails();
  }, [params.id, router]);

  // Handle updating the referral status
  const handleUpdateStatus = async (referralId: string, newStatus: ReferralStatus) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update local state to reflect the status change
      if (referral) {
        const updatedReferral = { 
          ...referral, 
          status: newStatus,
          updatedAt: new Date(),
          auditTrail: [
            ...referral.auditTrail,
            {
              fromStatus: referral.status,
              toStatus: newStatus,
              changedAt: new Date(),
              changedBy: 'current-user-id', // Would be the actual user ID in a real app
              notes: `Status updated to ${newStatus}`
            }
          ]
        };
        
        setReferral(updatedReferral);
      }
    } catch (error) {
      console.error('Error updating referral status:', error);
      // Show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  // Handle scheduling an appointment for the referral
  const handleScheduleAppointment = (referralId: string) => {
    // In a real app, this would navigate to the appointment scheduling flow
    // with the referral ID passed as a parameter
    router.push(`/appointments/new?referralId=${referralId}`);
  };

  // Handle navigating back to the referrals list
  const handleBack = () => {
    router.push('/referrals');
  };

  if (isLoading && !referral) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (!referral) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700">Referral Not Found</h2>
          <p className="mt-2 text-gray-500">The referral you&apos;re looking for does not exist or has been removed.</p>
          <button 
            className="mt-6 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
            onClick={() => router.push('/referrals')}
          >
            Return to Referrals List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ReferralDetails
        referral={referral}
        patient={patient!}
        referringProvider={referringProvider!}
        receivingProvider={receivingProvider!}
        isLoading={isLoading}
        onBack={handleBack}
        onUpdateStatus={handleUpdateStatus}
        onScheduleAppointment={handleScheduleAppointment}
      />
    </div>
  );
}