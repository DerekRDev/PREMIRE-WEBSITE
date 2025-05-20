import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PatientIntake } from '@/core/entities/PatientIntake';
import { Button } from '@/ui/design-system/components/Button';
import { Card } from '@/ui/design-system/components/Card';
import dynamic from 'next/dynamic';

// Dynamically import the Confetti component to avoid SSR issues
const ReactConfetti = dynamic(() => import('react-confetti'), { ssr: false });

interface IntakeConfirmationProps {
  intake: PatientIntake;
  isComplete: boolean;
  onBack?: () => void;
}

export const IntakeConfirmation: React.FC<IntakeConfirmationProps> = ({
  intake,
  isComplete,
  onBack,
}) => {
  const router = useRouter();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [navigating, setNavigating] = useState(false);

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial window size
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Show confetti if the intake is complete
    if (isComplete && !navigating) {
      setShowConfetti(true);
      
      // Show thank you message briefly and then prepare for navigation
      const confettiTimer = setTimeout(() => {
        setShowConfetti(false);
        setShowThankYou(true);
      }, 3500);
      
      // Navigate to appointments after showing thank you message
      const navigationTimer = setTimeout(() => {
        setNavigating(true);
        // Fade out animation occurs here
        
        // Then navigate after the fade out
        const finalNavigationTimer = setTimeout(() => {
          router.push('/appointments');
        }, 1500);
        
        return () => clearTimeout(finalNavigationTimer);
      }, 6000);
      
      return () => {
        clearTimeout(confettiTimer);
        clearTimeout(navigationTimer);
        window.removeEventListener('resize', handleResize);
      };
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [isComplete, navigating, router]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <Card className={`p-6 transition-opacity duration-1000 ${navigating ? 'opacity-0' : 'opacity-100'}`}>
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}
      
      {/* Transition message that appears briefly before navigation */}
      {showThankYou && !navigating && (
        <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-700 bg-white bg-opacity-80">
          <div className="text-center p-8 rounded-lg">
            <div className="mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-blue-100">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-blue-700 mb-4">Your intake is complete!</h2>
            <p className="text-xl text-gray-700">We're taking you to your appointments now...</p>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        {isComplete ? (
          <>
            <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600">Registration Complete!</h2>
            <p className="text-gray-600 mt-2">
              Thank you for completing your pre-appointment registration.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-blue-600">Registration Summary</h2>
            <p className="text-gray-600 mt-2">
              Please review your information before submitting.
            </p>
          </>
        )}
      </div>

      <div className="space-y-6">
        {/* Patient Information */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Patient Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <span className="text-gray-500">Name:</span>{' '}
                <span className="font-medium">
                  {intake.demographics.firstName} {intake.demographics.middleName} {intake.demographics.lastName}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Date of Birth:</span>{' '}
                <span className="font-medium">
                  {new Date(intake.demographics.dateOfBirth).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Phone:</span>{' '}
                <span className="font-medium">{intake.demographics.phone}</span>
              </div>
              <div>
                <span className="text-gray-500">Email:</span>{' '}
                <span className="font-medium">{intake.demographics.email}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-500">Address:</span>{' '}
                <span className="font-medium">
                  {intake.demographics.address1}
                  {intake.demographics.address2 && `, ${intake.demographics.address2}`}, 
                  {intake.demographics.city}, {intake.demographics.state} {intake.demographics.zipCode}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Insurance Information */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Insurance</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            {intake.insurance.length === 0 ? (
              <p className="text-gray-500 italic">No insurance information provided.</p>
            ) : (
              <div className="space-y-4">
                {intake.insurance.map((insurance, index) => (
                  <div key={index} className={index > 0 ? 'border-t pt-4' : ''}>
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {insurance.isPrimary ? 'Primary Insurance' : 'Secondary Insurance'}
                      </span>
                      {insurance.verificationStatus && (
                        <span className={`text-sm ${
                          insurance.verificationStatus === 'verified' 
                            ? 'text-green-600' 
                            : insurance.verificationStatus === 'failed'
                              ? 'text-red-600'
                              : 'text-blue-600'
                        }`}>
                          {insurance.verificationStatus === 'verified' && '✓ Verified'}
                          {insurance.verificationStatus === 'failed' && '✗ Verification Failed'}
                          {insurance.verificationStatus === 'pending' && '⟳ Pending Verification'}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-2">
                      <div>
                        <span className="text-gray-500">Provider:</span>{' '}
                        <span>{insurance.provider}</span>
                      </div>
                      {insurance.planName && (
                        <div>
                          <span className="text-gray-500">Plan:</span>{' '}
                          <span>{insurance.planName}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">Member ID:</span>{' '}
                        <span>{insurance.memberId}</span>
                      </div>
                      {insurance.groupNumber && (
                        <div>
                          <span className="text-gray-500">Group #:</span>{' '}
                          <span>{insurance.groupNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Medical History Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Medical History</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-3">
              {/* Conditions */}
              <div>
                <span className="text-gray-500 font-medium">Conditions:</span>{' '}
                {intake.medicalHistory.conditions.length === 0 ? (
                  <span className="italic">None reported</span>
                ) : (
                  <span>{intake.medicalHistory.conditions.join(', ')}</span>
                )}
              </div>
              
              {/* Allergies */}
              <div>
                <span className="text-gray-500 font-medium">Allergies:</span>{' '}
                {!intake.medicalHistory.allergies.hasAllergies ? (
                  <span className="italic">No known allergies</span>
                ) : (
                  <span>
                    {intake.medicalHistory.allergies.items.map(a => a.name).join(', ')}
                  </span>
                )}
              </div>
              
              {/* Medications */}
              <div>
                <span className="text-gray-500 font-medium">Medications:</span>{' '}
                {intake.medicalHistory.medications.length === 0 ? (
                  <span className="italic">None reported</span>
                ) : (
                  <span>
                    {intake.medicalHistory.medications.map(m => m.name).join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Consent Forms */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Consent Forms</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            {intake.consentForms.length === 0 ? (
              <p className="text-gray-500 italic">No consent forms signed.</p>
            ) : (
              <ul className="space-y-2">
                {intake.consentForms.map((form, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{form.name}</span>
                    {form.signedAt ? (
                      <span className="text-green-600">
                        Signed on {new Date(form.signedAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-red-600">Not signed</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Completion Information */}
        {isComplete && intake.completedAt && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Your registration was completed on {formatDate(intake.completedAt)}.
            </p>
            <p className="mt-2 text-gray-600">
              Your intake information has been saved and will be available to your healthcare provider.
            </p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {onBack && !isComplete && (
            <Button
              variant="outline"
              onClick={onBack}
              type="button"
            >
              Back
            </Button>
          )}
          
          {isComplete ? (
            <Button
              variant="primary"
              onClick={() => window.location.href = '/appointments'}
              className="mx-auto"
            >
              View Appointments
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={onBack}
              type="button"
              className={!onBack ? 'mx-auto' : 'ml-auto'}
            >
              Make Changes
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};