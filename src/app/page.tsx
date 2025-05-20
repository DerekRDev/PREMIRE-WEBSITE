'use client';

import { Button, Card } from '@/ui/design-system/components';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary-700">
            Premier Healthcare Platform
          </h1>
          <p className="text-xl text-neutral-600">
            A complete solution for patient scheduling, intake, and referral management
          </p>
        </div>

        <div className="grid gap-8 mb-12">
          <Card
            title="Patient Scheduling"
            className="transform transition-all duration-300 hover:-translate-y-1"
          >
            <p className="text-neutral-600 mb-4">
              Find the perfect appointment time with your preferred provider. Our
              scheduling system makes it easy to find and book appointments.
            </p>
            <div className="flex justify-end">
              <Button 
                variant="primary" 
                onClick={() => router.push('/appointments')}
              >
                Schedule Now
              </Button>
            </div>
          </Card>

          <Card 
            title="Patient Intake Forms" 
            className="transform transition-all duration-300 hover:-translate-y-1"
          >
            <p className="text-neutral-600 mb-4">
              Complete your registration and intake forms online before your appointment.
              Save time and reduce paperwork during your visit.
            </p>
            <div className="flex justify-end">
              <Button 
                variant="primary"
                onClick={() => router.push('/intake?patientId=demopatient123')}
              >
                Start Intake
              </Button>
            </div>
          </Card>

          <Card 
            title="Referral Management" 
            className="transform transition-all duration-300 hover:-translate-y-1"
          >
            <p className="text-neutral-600 mb-4">
              Easily track and manage your referrals to specialists. Stay informed
              at every step of the referral process.
            </p>
            <div className="flex justify-end">
              <Button 
                variant="primary"
                onClick={() => router.push('/referrals')}
              >
                Manage Referrals
              </Button>
            </div>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-neutral-500 mb-4">
            Need assistance? Contact our support team
          </p>
          <Button 
            variant="outline"
            onClick={() => router.push('/help')}
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}