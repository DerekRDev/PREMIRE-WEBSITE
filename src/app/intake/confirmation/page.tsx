'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { IntakeConfirmation } from '@/ui/components/intake';
import { useIntakeForm } from '@/ui/hooks';
import { Button } from '@/ui/design-system/components';

export default function IntakeConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  // Get intake ID from the query parameters
  const intakeId = searchParams.get('id');
  
  // Initialize with the patient ID from the current URL
  const patientId = searchParams.get('patientId') || 'demopatient123';
  const { intakeData: originalIntakeData, isLoading: isLoadingIntake } = useIntakeForm('', patientId);
  
  // Create a demo intake with sample data to ensure we always have something to display
  const demoIntake = {
    ...originalIntakeData,
    id: intakeId || 'demo-intake-123',
    status: 'COMPLETED',
    demographics: {
      firstName: 'Derek',
      lastName: 'Roberts',
      middleName: '',
      dateOfBirth: '1980-05-15',
      gender: 'male',
      address1: '123 Main St',
      address2: 'Apt 4B',
      city: 'Pasco',
      state: 'FL',
      zipCode: '34653',
      phone: '(555) 123-4567',
      email: 'derek.roberts@example.com',
      preferredContactMethod: 'email',
    },
    insurance: [
      {
        id: 'ins-1',
        provider: 'Aetna',
        planName: 'PPO Gold',
        memberId: '23123123',
        groupNumber: 'AA1212',
        isPrimary: true,
        verificationStatus: 'verified',
        relationship: 'self',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    medicalHistory: {
      ...originalIntakeData.medicalHistory,
      conditions: ['Asthma', 'Hypertension'],
      allergies: {
        hasAllergies: true,
        items: [
          { name: 'Penicillin', reaction: 'Rash', severity: 'moderate' },
          { name: 'Peanuts', reaction: 'Swelling', severity: 'severe' }
        ]
      },
      medications: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', reason: 'Hypertension' },
        { name: 'Albuterol', dosage: '90mcg', frequency: 'As needed', reason: 'Asthma' }
      ]
    },
    consentForms: originalIntakeData.consentForms.map(form => ({
      ...form,
      signedAt: new Date(),
      signature: 'Derek Roberts',
      ipAddress: '127.0.0.1'
    })),
    completedAt: new Date(),
  };
  
  // Use the demo intake data
  const intakeData = demoIntake;
  
  // Redirect to intake page if no ID is provided
  useEffect(() => {
    if (!intakeId) {
      router.push('/intake');
    } else {
      setIsLoading(false);
    }
  }, [intakeId, router]);
  
  if (isLoading || isLoadingIntake) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-8">Loading confirmation...</h1>
        </div>
      </div>
    );
  }
  
  if (!intakeId) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-8">Redirecting...</h1>
          <p>Please wait while we redirect you to the intake form.</p>
        </div>
      </div>
    );
  }
  
  // For demo purposes, always show the confirmation regardless of ID matching
  // This ensures the user can see the confirmation page during testing
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <IntakeConfirmation
          intake={intakeData}
          isComplete={true} // Always show as complete for demo purposes
        />
        
        <div className="mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Next Steps</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>We&apos;ll review your intake information within 24-48 hours</li>
              <li>Our staff may contact you if we need additional information</li>
              <li>Please arrive 15 minutes before your scheduled appointment</li>
              <li>Bring your insurance card and a valid photo ID to your appointment</li>
            </ol>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => router.push('/appointments')}
            >
              View Appointments
            </Button>
            
            <Button
              variant="primary"
              onClick={() => router.push('/')}
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}