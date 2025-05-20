'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { IntakeFlow } from '@/ui/components/intake';
import { useIntakeForm } from '@/ui/hooks';

function IntakePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Get query parameters
  const appointmentId = searchParams.get('appointmentId') || undefined;
  const patientId = searchParams.get('patientId') || undefined;
  
  // Initialize the intake form
  const intakeFormHook = useIntakeForm(appointmentId, patientId);
  
  // Set loading to false after initial check
  useEffect(() => {
    setIsLoading(false);
  }, [appointmentId, patientId]);
  
  // Handle completion of the intake
  const handleComplete = (intakeId: string) => {
    router.push(`/intake/confirmation?id=${intakeId}`);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-8">Loading intake form...</h1>
        </div>
      </div>
    );
  }
  
  if (!appointmentId && !patientId) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-8">Patient Intake Forms</h1>
          <p className="text-lg mb-8">Complete your pre-appointment paperwork online to save time during your visit.</p>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Start a New Intake Form</h2>
            <p className="mb-6">Please select an option below to begin your intake process:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-medium mb-3">I have an appointment</h3>
                <p className="mb-4">If you already have a scheduled appointment, complete your paperwork here.</p>
                <button 
                  onClick={() => router.push('/appointments')}
                  className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                >
                  View My Appointments
                </button>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-medium mb-3">No appointment yet</h3>
                <p className="mb-4">Complete your paperwork in advance and then schedule your appointment.</p>
                <button 
                  onClick={() => router.push('/intake?patientId=demopatient123')}
                  className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                >
                  Start Intake Process
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <IntakeFlow
        appointmentId={appointmentId}
        patientId={patientId}
        onComplete={handleComplete}
        useIntakeFormHook={intakeFormHook}
      />
    </div>
  );
}

export default function IntakePage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-8">Loading intake form...</h1>
        </div>
      </div>
    }>
      <IntakePageContent />
    </Suspense>
  );
}