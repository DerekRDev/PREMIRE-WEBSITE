'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreateReferralRequest } from '@/core/entities/Referral';
import { Provider } from '@/core/entities/Provider';
import { ReferralForm } from '@/ui/components/referral';

export default function NewReferralPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId') || '';
  const referringProviderId = searchParams.get('referringProviderId') || '';
  
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);

  // This is a mock function that would normally fetch providers from an API
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Mock provider data
        const mockProviders: Provider[] = [
          {
            id: 'provider-1',
            firstName: 'Sarah',
            lastName: 'Smith',
            credentials: 'MD',
            specialties: ['Family Medicine', 'Primary Care'],
            npi: '1234567890',
            practiceName: 'Premier Primary Care',
            email: 'dr.smith@premierhealth.com',
            phone: '(555) 987-6543'
          },
          {
            id: 'provider-2',
            firstName: 'Michael',
            lastName: 'Johnson',
            credentials: 'MD, FACC',
            specialties: ['Cardiology', 'Interventional Cardiology'],
            npi: '0987654321',
            practiceName: 'Premier Cardiology Specialists',
            email: 'dr.johnson@premierhealth.com',
            phone: '(555) 321-7890'
          },
          {
            id: 'provider-3',
            firstName: 'Emily',
            lastName: 'Davis',
            credentials: 'MD',
            specialties: ['Dermatology'],
            npi: '5678901234',
            practiceName: 'Premier Dermatology',
            email: 'dr.davis@premierhealth.com',
            phone: '(555) 456-7890'
          },
          {
            id: 'provider-4',
            firstName: 'David',
            lastName: 'Wilson',
            credentials: 'MD',
            specialties: ['Family Medicine', 'Primary Care'],
            npi: '2345678901',
            practiceName: 'Premier Primary Care',
            email: 'dr.wilson@premierhealth.com',
            phone: '(555) 234-5678'
          },
          {
            id: 'provider-5',
            firstName: 'Jennifer',
            lastName: 'Brown',
            credentials: 'MD',
            specialties: ['Neurology'],
            npi: '3456789012',
            practiceName: 'Premier Neurology',
            email: 'dr.brown@premierhealth.com',
            phone: '(555) 678-9012'
          }
        ];
        
        setProviders(mockProviders);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };
    
    fetchProviders();
  }, []);

  // Handle form submission
  const handleSubmit = async (data: CreateReferralRequest) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // For demonstration purposes, log the submitted data
      console.log('Submitted referral data:', data);
      
      // Redirect to the referrals list with a success message
      router.push('/referrals?success=Referral submitted successfully');
    } catch (error) {
      console.error('Error submitting referral:', error);
      // In a real app, we would show an error message to the user
      setIsLoading(false);
      throw error; // Re-throw so the form component can handle it
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push('/referrals');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Referral</h1>
      
      <ReferralForm
        patientId={patientId}
        referringProviderId={referringProviderId}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        providers={providers}
      />
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Need help finding a specialist? Call (555) 123-4567 for assistance.</p>
      </div>
    </div>
  );
}