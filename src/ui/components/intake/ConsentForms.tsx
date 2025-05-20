import React, { useState } from 'react';
import { ConsentForm } from '@/core/entities/ConsentForm';
import { Button } from '@/ui/design-system/components/Button';
import { Card } from '@/ui/design-system/components/Card';
import { Tabs } from '@/ui/design-system/components/Tabs';
import { Input } from '@/ui/design-system/components/Input';
import { Modal } from '@/ui/design-system/components/Modal';

interface ConsentFormsProps {
  data: ConsentForm[];
  onChange: (data: ConsentForm[]) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const ConsentForms: React.FC<ConsentFormsProps> = ({
  data,
  onChange,
  onNext,
  onBack,
  isLoading = false,
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureValue, setSignatureValue] = useState('');
  const [signatureError, setSignatureError] = useState('');
  const [currentFormId, setCurrentFormId] = useState<string | null>(null);

  const openSignatureModal = (formId: string) => {
    setCurrentFormId(formId);
    setSignatureValue('');
    setSignatureError('');
    setShowSignatureModal(true);
  };

  const handleSignForm = () => {
    if (!signatureValue.trim()) {
      setSignatureError('Signature is required');
      return;
    }

    if (!currentFormId) {
      console.error("No current form ID when trying to sign form");
      return;
    }

    // Find the form
    const formIndex = data.findIndex(form => form.id === currentFormId);
    if (formIndex === -1) {
      console.error(`Form with ID ${currentFormId} not found in data`);
      return;
    }

    // Create a new Date object for signed timestamp
    const signedTimestamp = new Date();

    // Update the form with signature
    const updatedForms = [...data];
    updatedForms[formIndex] = {
      ...updatedForms[formIndex],
      signature: signatureValue,
      signedAt: signedTimestamp,
      ipAddress: '127.0.0.1', // In a real app, this would be the user's IP
    };

    // For debugging
    console.log(`Form ${currentFormId} signed at ${signedTimestamp}`);
    console.log("Signed form:", updatedForms[formIndex]);
    console.log("All forms after signing:", updatedForms);

    // Update parent state with signed forms
    onChange(updatedForms);
    setShowSignatureModal(false);
  };

  const validateForms = (): boolean => {
    // Check if all required forms are signed
    const requiredForms = data.filter(form => form.requiredForIntake);
    const unsignedRequiredForms = requiredForms.filter(form => !form.signedAt || !form.signature);
    
    // For debugging
    console.log("ConsentForms validateForms - All forms:", data);
    console.log("ConsentForms validateForms - Required forms:", requiredForms);
    console.log("ConsentForms validateForms - Unsigned required forms:", unsignedRequiredForms);
    
    // Detailed logging of each form's state
    data.forEach(form => {
      console.log(`Form ${form.id}: ${form.name}`, {
        required: form.requiredForIntake,
        signed: !!form.signedAt,
        signature: !!form.signature,
        signedAt: form.signedAt
      });
    });
    
    return unsignedRequiredForms.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For debugging
    console.log("Form submission - All forms:", data);
    console.log("Form validation result:", validateForms());
    
    // Double-check validation
    const requiredForms = data.filter(form => form.requiredForIntake);
    const unsignedRequiredForms = requiredForms.filter(form => !form.signedAt || !form.signature);
    
    if (unsignedRequiredForms.length === 0) {
      console.log("All required forms are signed, proceeding to next step");
      onNext();
    } else {
      console.error("Some required forms are not signed:", unsignedRequiredForms);
      alert('Please sign all required consent forms before continuing.');
    }
  };

  // Pre-set signed status for testing
  // This is just for development to avoid having to sign all forms manually
  const handlePreSignForms = () => {
    const currentDate = new Date();
    const updatedForms = data.map(form => ({
      ...form,
      signedAt: form.signedAt || currentDate,
      signature: form.signature || 'Auto Signed For Testing',
      ipAddress: form.ipAddress || '127.0.0.1'
    }));
    
    onChange(updatedForms);
  };

  // Group forms by whether they are required or not
  const requiredForms = data.filter(form => form.requiredForIntake);
  const optionalForms = data.filter(form => !form.requiredForIntake);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Consent Forms</h2>
      <p className="text-sm text-gray-600 mb-6">
        Please review and sign the following consent forms. Forms marked with
        an asterisk (*) are required before your appointment.
      </p>

      {/* For testing only - allows to automatically sign all forms */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mb-4">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handlePreSignForms}
          >
            Auto-Sign All Forms (Dev Only)
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Required Forms Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Required Forms</h3>
            {requiredForms.length === 0 ? (
              <p className="text-gray-500 italic">No required forms to sign.</p>
            ) : (
              <div className="space-y-4">
                {requiredForms.map((form) => (
                  <div key={form.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{form.name} *</h4>
                        <p className="text-sm text-gray-500">Version: {form.version}</p>
                      </div>
                      <div className="flex items-center">
                        {form.signedAt ? (
                          <div className="text-green-600 flex items-center">
                            <span className="mr-2">✓ Signed</span>
                            <span className="text-sm text-gray-500">
                              {new Date(form.signedAt).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => openSignatureModal(form.id)}
                            size="sm"
                          >
                            Sign Now
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => {
                          // In a real app, this would open the form in a viewer
                          alert(`View form content: ${form.content.substring(0, 100)}...`);
                        }}
                        size="sm"
                      >
                        View Document
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Optional Forms Section */}
          {optionalForms.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Optional Forms</h3>
              <div className="space-y-4">
                {optionalForms.map((form) => (
                  <div key={form.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{form.name}</h4>
                        <p className="text-sm text-gray-500">Version: {form.version}</p>
                      </div>
                      <div className="flex items-center">
                        {form.signedAt ? (
                          <div className="text-green-600 flex items-center">
                            <span className="mr-2">✓ Signed</span>
                            <span className="text-sm text-gray-500">
                              {new Date(form.signedAt).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => openSignatureModal(form.id)}
                            size="sm"
                          >
                            Sign Now
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => {
                          // In a real app, this would open the form in a viewer
                          alert(`View form content: ${form.content.substring(0, 100)}...`);
                        }}
                        size="sm"
                      >
                        View Document
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
            type="button"
          >
            Back
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isLoading || !validateForms()}
          >
            {isLoading ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </form>

      {/* Signature Modal */}
      <Modal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        title="Sign Consent Form"
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            By signing this form, you acknowledge that you have read and understand the 
            content and agree to the terms and conditions described.
          </p>

          <div className="border-t border-b py-4">
            <p className="text-center text-sm text-gray-500 mb-2">
              Please type your full legal name below to sign electronically
            </p>
            <Input
              value={signatureValue}
              onChange={(e) => {
                setSignatureValue(e.target.value);
                if (e.target.value.trim()) {
                  setSignatureError('');
                }
              }}
              placeholder="Type your full name"
              error={signatureError}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowSignatureModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSignForm}
            >
              Sign Document
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};