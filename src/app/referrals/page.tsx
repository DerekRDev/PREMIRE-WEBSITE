'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Referral } from '@/core/entities/Referral';
import { ReferralList } from '@/ui/components/referral/ReferralList';
import { Button } from '@/ui/design-system/components/Button';

export default function ReferralsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [referrals, setReferrals] = useState<Referral[]>([]);

  // This is a mock function that would normally fetch data from an API
  useEffect(() => {
    // Simulate API call with timeout
    const fetchReferrals = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mock referral data
        const mockReferrals: Referral[] = [
          {
            id: 'ref-1',
            patientId: 'patient-1',
            createdAt: new Date('2023-10-15'),
            updatedAt: new Date('2023-10-15'),
            status: 'SUBMITTED',
            referringProviderId: 'provider-1',
            receivingProviderId: 'provider-2',
            specialtyType: 'Cardiology',
            reason: 'Patient experiencing chest pains and shortness of breath.',
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
          },
          {
            id: 'ref-2',
            patientId: 'patient-2',
            createdAt: new Date('2023-10-10'),
            updatedAt: new Date('2023-10-14'),
            status: 'COMPLETED',
            referringProviderId: 'provider-1',
            receivingProviderId: 'provider-3',
            specialtyType: 'Dermatology',
            reason: 'Suspicious skin lesion on lower back.',
            urgencyLevel: 'ROUTINE',
            appointmentId: 'apt-123',
            auditTrail: [
              {
                fromStatus: 'DRAFT',
                toStatus: 'SUBMITTED',
                changedAt: new Date('2023-10-10'),
                changedBy: 'user-1',
                notes: 'Initial referral submission'
              },
              {
                fromStatus: 'SUBMITTED',
                toStatus: 'PROCESSING',
                changedAt: new Date('2023-10-11'),
                changedBy: 'user-2',
                notes: 'Referral received by dermatology department'
              },
              {
                fromStatus: 'PROCESSING',
                toStatus: 'SCHEDULED',
                changedAt: new Date('2023-10-12'),
                changedBy: 'user-2',
                notes: 'Appointment scheduled for Oct 20'
              },
              {
                fromStatus: 'SCHEDULED',
                toStatus: 'COMPLETED',
                changedAt: new Date('2023-10-14'),
                changedBy: 'user-3',
                notes: 'Patient seen by Dr. Johnson, biopsy performed'
              }
            ]
          },
          {
            id: 'ref-3',
            patientId: 'patient-3',
            createdAt: new Date('2023-10-12'),
            updatedAt: new Date('2023-10-13'),
            status: 'PROCESSING',
            referringProviderId: 'provider-4',
            receivingProviderId: 'provider-5',
            specialtyType: 'Neurology',
            reason: 'Recurring migraines, not responding to current medication.',
            urgencyLevel: 'ROUTINE',
            auditTrail: [
              {
                fromStatus: 'DRAFT',
                toStatus: 'SUBMITTED',
                changedAt: new Date('2023-10-12'),
                changedBy: 'user-4',
                notes: 'Referral submitted'
              },
              {
                fromStatus: 'SUBMITTED',
                toStatus: 'PROCESSING',
                changedAt: new Date('2023-10-13'),
                changedBy: 'user-5',
                notes: 'Under review by neurology department'
              }
            ]
          }
        ];
        
        setReferrals(mockReferrals);
      } catch (error) {
        console.error('Error fetching referrals:', error);
        // In a real app, we would handle errors better
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReferrals();
  }, []);

  // Handle viewing details for a specific referral
  const handleViewDetails = (referralId: string) => {
    router.push(`/referrals/${referralId}`);
  };

  // Handle creating a new referral
  const handleCreateNew = () => {
    router.push('/referrals/new');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Referrals</h1>
        <Button 
          onClick={handleCreateNew}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
        >
          Create New Referral
        </Button>
      </div>
      
      <ReferralList
        referrals={referrals}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onCreateNew={handleCreateNew}
        showCreateButton={false}
        emptyMessage="No referrals found. Click 'Create New Referral' to get started."
      />
    </div>
  );
}