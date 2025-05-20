import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PatientIntake } from '@/core/entities/PatientIntake';
import { Card } from '@/ui/design-system/components/Card';
import { DemographicsForm } from './DemographicsForm';
import { InsuranceVerification } from './InsuranceVerification';
import { MedicalHistoryForm } from './MedicalHistoryForm';
import { ConsentForms } from './ConsentForms';
import { IntakeConfirmation } from './IntakeConfirmation';

// Stepper component to show progress
const Stepper: React.FC<{
  steps: string[];
  currentStep: number;
  onChange?: (step: number) => void;
}> = ({ steps, currentStep, onChange }) => {
  return (
    <div className="mb-12 relative">
      {/* Progress bar and circles */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step circle */}
            <div 
              className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 
                ${index <= currentStep 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white text-gray-500 border-gray-300'}`}
              onClick={() => onChange && index < currentStep && onChange(index)}
              style={{ cursor: onChange && index < currentStep ? 'pointer' : 'default' }}
            >
              {index < currentStep ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 
                ${index < currentStep 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300'}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Step labels */}
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`text-xs font-medium text-center ${
              index <= currentStep ? 'text-blue-500' : 'text-gray-500'
            }`}
            style={{ width: '20%', marginLeft: index === 0 ? '0' : 'auto', marginRight: index === steps.length - 1 ? '0' : 'auto' }}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};

interface IntakeFlowProps {
  appointmentId?: string;
  patientId?: string;
  initialStep?: number;
  onComplete?: (intakeId: string) => void;
  useIntakeFormHook: {
    intakeData: PatientIntake;
    isLoading: boolean;
    saveProgress: () => Promise<void>;
    submitIntake: (skipValidation?: boolean) => Promise<void>;
    setIntakeData: React.Dispatch<React.SetStateAction<PatientIntake>>;
    verifyInsurance: (insuranceInfo: PatientIntake['insurance']) => Promise<{ verified: boolean }>;
    validateStep: (step?: number) => Promise<boolean>;
  };
}

export const IntakeFlow: React.FC<IntakeFlowProps> = ({
  appointmentId,
  patientId,
  initialStep = 0,
  onComplete,
  useIntakeFormHook
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    intakeData, 
    setIntakeData, 
    saveProgress, 
    submitIntake,
    isLoading,
    verifyInsurance,
    validateStep
  } = useIntakeFormHook;

  // Update the current step when the lastSavedStep in intakeData changes
  useEffect(() => {
    if (intakeData.lastSavedStep !== undefined && intakeData.lastSavedStep > currentStep) {
      setCurrentStep(intakeData.lastSavedStep);
    }
  }, [intakeData.lastSavedStep]);

  const handleNext = async (step: number) => {
    try {
      // Validate the current step before moving to the next
      const currentStepIndex = currentStep;
      console.log(`Validating step ${currentStepIndex} before moving to step ${step}`);
      
      // Only validate if moving forward
      if (step > currentStepIndex) {
        await validateStep(currentStepIndex);
      }
      
      await saveProgress();
      setCurrentStep(step);
    } catch (error) {
      console.error('Error saving progress:', error);
      
      // Format error message nicely for the user
      let errorMessage = 'There was an error saving your progress. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Create a more user-friendly dialog instead of basic alert
      const errorDialog = document.createElement('div');
      errorDialog.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50';
      errorDialog.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-red-600">Form Validation Error</h3>
          </div>
          <div class="mb-6">
            <p class="mb-2">Please correct the following issues:</p>
            <div class="text-sm bg-gray-50 p-3 rounded border">
              ${errorMessage}
            </div>
          </div>
          <div class="flex justify-end">
            <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" id="errorDialogClose">
              OK
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(errorDialog);
      document.getElementById('errorDialogClose')?.addEventListener('click', () => {
        document.body.removeChild(errorDialog);
      });
    }
  };

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate only the current step (consent forms) before submission
      console.log("Validating consent forms before submission");
      await validateStep(3); // Step 3 is consent forms

      // When we get here, consent forms are valid
      console.log("Consent forms are valid, proceeding to submit");
      
      // Submit the intake with skipValidation flag set to true
      await submitIntake(true);
      
      // For demo purposes, always redirect to confirmation
      const patientIdParam = patientId ? `&patientId=${patientId}` : '';
      const confirmationUrl = `/intake/confirmation?id=${intakeData.id || 'demo-intake'}${patientIdParam}`;
      console.log(`Redirecting to: ${confirmationUrl}`);
      
      // Use onComplete callback if provided, otherwise redirect directly
      if (onComplete && intakeData.id) {
        onComplete(intakeData.id);
      } else {
        router.push(confirmationUrl);
      }
    } catch (error) {
      console.error('Error completing intake:', error);
      
      // Format error message nicely for the user
      let errorMessage = 'There was an error submitting your intake form. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Create a more user-friendly dialog instead of basic alert
      // This shows what exactly needs to be fixed
      const errorDialog = document.createElement('div');
      errorDialog.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50';
      errorDialog.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-auto">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-red-600">Form Validation Error</h3>
          </div>
          <div class="mb-6">
            <p class="mb-2">Please correct the following issues:</p>
            <div class="text-sm bg-gray-50 p-3 rounded border">
              ${errorMessage.replace(/\n/g, '<br>')}
            </div>
          </div>
          <div class="flex justify-end">
            <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" id="errorDialogClose">
              OK
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(errorDialog);
      
      // Helper function to navigate to the right section based on error message
      const navigateToErrorSection = () => {
        document.body.removeChild(errorDialog);
        
        // Check error message to determine which step to navigate to
        if (errorMessage.includes('Insurance information is incomplete')) {
          // Go to insurance step
          setCurrentStep(1);
        } else if (errorMessage.includes('Demographics information is incomplete')) {
          // Go to demographics step
          setCurrentStep(0);
        } else if (errorMessage.includes('consent forms must be signed')) {
          // Go to consent forms step
          setCurrentStep(3);
        }
      };
      
      // Add event listener to close button
      document.getElementById('errorDialogClose')?.addEventListener('click', navigateToErrorSection);
      return false;
    } finally {
      setIsSubmitting(false);
    }
    
    return true;
  };

  const steps = [
    {
      label: 'Personal Info',
      component: (
        <DemographicsForm
          data={intakeData.demographics}
          onChange={(demographics) => setIntakeData({...intakeData, demographics})}
          onNext={() => handleNext(1)}
          isLoading={isLoading}
        />
      )
    },
    {
      label: 'Insurance',
      component: (
        <InsuranceVerification
          data={intakeData.insurance}
          onChange={(insurance) => setIntakeData({...intakeData, insurance})}
          onNext={async () => {
            await saveProgress();
            try {
              // Verify insurance in real-time
              const result = await verifyInsurance(intakeData.insurance);
              // Even if verification fails, we still allow proceeding
              handleNext(2);
            } catch (error) {
              console.error('Insurance verification error:', error);
              // Still allow proceeding even if verification fails
              handleNext(2);
            }
          }}
          onBack={() => setCurrentStep(0)}
          isLoading={isLoading}
        />
      )
    },
    {
      label: 'Medical History',
      component: (
        <MedicalHistoryForm
          data={intakeData.medicalHistory}
          onChange={(medicalHistory) => setIntakeData({...intakeData, medicalHistory})}
          onNext={() => handleNext(3)}
          onBack={() => setCurrentStep(1)}
          isLoading={isLoading}
        />
      )
    },
    {
      label: 'Consent',
      component: (
        <ConsentForms
          data={intakeData.consentForms}
          onChange={(consentForms) => setIntakeData({...intakeData, consentForms})}
          onNext={async () => {
            // First save the progress with updated consent forms
            await saveProgress();
            
            // Check if payment is required
            if (intakeData.paymentRequired) {
              handleNext(4);
            } else {
              handleComplete();
            }
          }}
          onBack={() => setCurrentStep(2)}
          isLoading={isLoading || isSubmitting}
        />
      )
    },
    {
      label: 'Confirmation',
      component: (
        <IntakeConfirmation
          intake={intakeData}
          isComplete={intakeData.status === 'COMPLETED'}
          onBack={() => setCurrentStep(3)}
        />
      )
    }
  ];

  return (
    <div className="max-w-3xl mx-auto pb-16">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Pre-Appointment Registration
        </h1>
        
        <Stepper 
          steps={steps.map(s => s.label)} 
          currentStep={currentStep} 
          onChange={(step) => {
            // Only allow going back to previous steps
            if (step < currentStep) {
              setCurrentStep(step);
            }
          }}
        />
        
        <div className="mt-8">
          {steps[currentStep].component}
        </div>
        
        <div className="mt-6 text-sm text-gray-500 text-center">
          <p>Your information is secure and protected by HIPAA regulations.</p>
          <p className="mt-2">Need assistance? Call us at (555) 123-4567</p>
        </div>
      </Card>
    </div>
  );
};