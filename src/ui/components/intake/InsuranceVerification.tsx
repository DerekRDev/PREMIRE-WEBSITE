import React, { useState } from 'react';
import { InsuranceInfo } from '@/core/entities/InsuranceInfo';
import { Button } from '@/ui/design-system/components/Button';
import { Input } from '@/ui/design-system/components/Input';
import { Select } from '@/ui/design-system/components/Select';
import { Card } from '@/ui/design-system/components/Card';
import { Modal } from '@/ui/design-system/components/Modal';

interface InsuranceVerificationProps {
  data: InsuranceInfo[];
  onChange: (data: InsuranceInfo[]) => void;
  onNext: () => void;
  onBack: () => void;
  onVerify?: (insurance: InsuranceInfo) => Promise<boolean>;
  isLoading?: boolean;
}

// Common insurance providers
const INSURANCE_PROVIDERS = [
  'Aetna',
  'Anthem',
  'Blue Cross Blue Shield',
  'Cigna',
  'Humana',
  'Kaiser Permanente',
  'Medicare',
  'Medicaid',
  'UnitedHealthcare',
  'Tricare',
  'Other',
];

export const InsuranceVerification: React.FC<InsuranceVerificationProps> = ({
  data,
  onChange,
  onNext,
  onBack,
  onVerify,
  isLoading = false,
}) => {
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentInsuranceIndex, setCurrentInsuranceIndex] = useState<number | null>(null);

  const handleChange = (index: number, field: keyof InsuranceInfo, value: any) => {
    const updatedInsurance = [...data];
    updatedInsurance[index] = {
      ...updatedInsurance[index],
      [field]: value,
    };

    // If this is marked as primary, set all others to non-primary
    if (field === 'isPrimary' && value === true) {
      updatedInsurance.forEach((ins, i) => {
        if (i !== index) {
          updatedInsurance[i] = {
            ...updatedInsurance[i],
            isPrimary: false,
          };
        }
      });
    }

    onChange(updatedInsurance);

    // Clear error when field is updated
    if (errors[index]?.[field]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[index][field];
      setErrors(updatedErrors);
    }
  };

  const addInsurance = () => {
    onChange([
      ...data,
      {
        id: `temp-${Date.now()}`,
        provider: '',
        planName: '',
        memberId: '',
        groupNumber: '',
        subscriberName: '',
        subscriberDob: '',
        relationship: 'self',
        isPrimary: data.length === 0, // First insurance is primary by default
        verificationStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  };

  const removeInsurance = (index: number) => {
    // Don't allow removing if it's the only insurance
    if (data.length === 1) {
      return;
    }

    const updatedInsurance = [...data];
    updatedInsurance.splice(index, 1);

    // If we removed the primary insurance and there's still some left,
    // make the first one primary
    if (data[index].isPrimary && updatedInsurance.length > 0) {
      updatedInsurance[0] = {
        ...updatedInsurance[0],
        isPrimary: true,
      };
    }

    onChange(updatedInsurance);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, Record<string, string>> = {};
    let isValid = true;

    data.forEach((insurance, index) => {
      newErrors[index] = {};

      // Required fields
      if (!insurance.provider) {
        newErrors[index].provider = 'Insurance provider is required';
        isValid = false;
      }

      if (!insurance.memberId) {
        newErrors[index].memberId = 'Member ID is required';
        isValid = false;
      }

      // Check if at least one insurance is marked as primary
      if (index === 0 && !insurance.isPrimary && !data.some(ins => ins.isPrimary)) {
        newErrors[index].isPrimary = 'At least one insurance must be marked as primary';
        isValid = false;
      }

      // If not self, subscriber info is required
      if (insurance.relationship && insurance.relationship !== 'self') {
        if (!insurance.subscriberName) {
          newErrors[index].subscriberName = 'Subscriber name is required';
          isValid = false;
        }
        if (!insurance.subscriberDob) {
          newErrors[index].subscriberDob = 'Subscriber date of birth is required';
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleVerify = async (index: number) => {
    if (!onVerify) return;

    try {
      setIsVerifying(true);
      const verified = await onVerify(data[index]);
      
      // Update the insurance verification status
      const updatedInsurance = [...data];
      updatedInsurance[index] = {
        ...updatedInsurance[index],
        verificationStatus: verified ? 'verified' : 'failed',
      };
      
      onChange(updatedInsurance);
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const handleUploadInsuranceCard = (index: number) => {
    setCurrentInsuranceIndex(index);
    setShowUploadModal(true);
  };

  const handleImageUpload = (type: 'front' | 'back', imageUrl: string) => {
    if (currentInsuranceIndex === null) return;
    
    const updatedInsurance = [...data];
    updatedInsurance[currentInsuranceIndex] = {
      ...updatedInsurance[currentInsuranceIndex],
      [type === 'front' ? 'cardFrontImageUrl' : 'cardBackImageUrl']: imageUrl,
    };
    
    onChange(updatedInsurance);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Insurance Information</h2>
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">
          Please provide your insurance information. We'll verify your coverage and benefits before your appointment.
          This helps us provide you with an estimate of your out-of-pocket costs.
        </p>
        
        <div className="bg-blue-50 p-3 rounded-md border border-blue-200 text-sm text-blue-800">
          <strong>Required information:</strong>
          <ul className="list-disc list-inside mt-1 ml-2">
            <li>Insurance provider name</li>
            <li>Member ID (found on your insurance card)</li>
            <li>At least one insurance must be marked as primary</li>
            <li>If you're not the primary policyholder, you'll need the subscriber's name and date of birth</li>
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {data.map((insurance, index) => (
          <div key={index} className="mb-8 p-5 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {insurance.isPrimary ? 'Primary Insurance' : `Secondary Insurance #${index}`}
              </h3>
              {data.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeInsurance(index)}
                  size="sm"
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <Select
                  label="Insurance Provider *"
                  value={insurance.provider}
                  onChange={(e) => handleChange(index, 'provider', e.target.value)}
                  error={errors[index]?.provider}
                  required
                  options={[
                    { value: '', label: 'Select an insurance provider' },
                    ...INSURANCE_PROVIDERS.map(provider => ({
                      value: provider,
                      label: provider
                    }))
                  ]}
                />
              </div>

              <Input
                label="Plan Name"
                value={insurance.planName || ''}
                onChange={(e) => handleChange(index, 'planName', e.target.value)}
                placeholder="E.g., PPO, HMO, Gold Plan"
              />

              <Input
                label="Member ID *"
                value={insurance.memberId}
                onChange={(e) => handleChange(index, 'memberId', e.target.value)}
                error={errors[index]?.memberId}
                placeholder="Insurance ID number"
                required
              />

              <Input
                label="Group Number"
                value={insurance.groupNumber || ''}
                onChange={(e) => handleChange(index, 'groupNumber', e.target.value)}
                placeholder="Group or policy number"
              />

              <Select
                label="Relationship to Subscriber"
                value={insurance.relationship || 'self'}
                onChange={(e) => handleChange(index, 'relationship', e.target.value)}
                options={[
                  { value: 'self', label: 'Self' },
                  { value: 'spouse', label: 'Spouse' },
                  { value: 'child', label: 'Child' },
                  { value: 'other', label: 'Other' },
                ]}
              />

              {insurance.relationship && insurance.relationship !== 'self' && (
                <>
                  <Input
                    label="Subscriber Name *"
                    value={insurance.subscriberName || ''}
                    onChange={(e) => handleChange(index, 'subscriberName', e.target.value)}
                    error={errors[index]?.subscriberName}
                    placeholder="Full name of the insurance policy holder"
                    required={insurance.relationship !== 'self'}
                  />

                  <Input
                    label="Subscriber Date of Birth *"
                    type="date"
                    value={insurance.subscriberDob || ''}
                    onChange={(e) => handleChange(index, 'subscriberDob', e.target.value)}
                    error={errors[index]?.subscriberDob}
                    required={insurance.relationship !== 'self'}
                  />
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleUploadInsuranceCard(index)}
              >
                Upload Insurance Card
              </Button>

              {(insurance.cardFrontImageUrl || insurance.cardBackImageUrl) && (
                <div className="text-sm text-green-600">
                  ✓ Insurance card uploaded
                </div>
              )}

              <div className="ml-auto flex items-center">
                <div className="mr-4">
                  <input
                    type="checkbox"
                    id={`isPrimary-${index}`}
                    checked={insurance.isPrimary}
                    onChange={(e) => handleChange(index, 'isPrimary', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor={`isPrimary-${index}`}>Set as Primary Insurance</label>
                  {errors[index]?.isPrimary && (
                    <p className="text-red-500 text-xs mt-1">{errors[index].isPrimary}</p>
                  )}
                </div>

                {onVerify && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleVerify(index)}
                    disabled={isVerifying}
                  >
                    {isVerifying ? 'Verifying...' : 'Verify Insurance'}
                  </Button>
                )}
              </div>
            </div>

            {insurance.verificationStatus && insurance.verificationStatus !== 'pending' && (
              <div className={`mt-4 p-3 rounded ${
                insurance.verificationStatus === 'verified' 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-red-50 text-red-800'
              }`}>
                {insurance.verificationStatus === 'verified' 
                  ? '✓ Insurance verified successfully! Your coverage is active.'
                  : '✗ We were unable to verify your insurance. Please check your information or contact your insurance provider.'}
              </div>
            )}
          </div>
        ))}

        <div className="mb-6">
          <Button type="button" variant="outline" onClick={addInsurance}>
            Add Another Insurance
          </Button>
        </div>

        <div className="flex justify-between">
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
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </form>

      {/* Insurance Card Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Insurance Card"
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            Please take a clear photo of the front and back of your insurance card.
            This helps us process your insurance accurately.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <div className="mb-3">Front of Card</div>
              {currentInsuranceIndex !== null && data[currentInsuranceIndex].cardFrontImageUrl ? (
                <div className="relative">
                  <img 
                    src={data[currentInsuranceIndex].cardFrontImageUrl} 
                    alt="Insurance Card Front" 
                    className="max-h-40 mx-auto"
                  />
                  <button 
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    onClick={() => handleImageUpload('front', '')}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                // In a real implementation, this would be replaced with a proper file upload component
                <Button 
                  variant="outline" 
                  onClick={() => handleImageUpload('front', 'https://example.com/placeholder-card-front.jpg')}
                >
                  Upload Front
                </Button>
              )}
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <div className="mb-3">Back of Card</div>
              {currentInsuranceIndex !== null && data[currentInsuranceIndex].cardBackImageUrl ? (
                <div className="relative">
                  <img 
                    src={data[currentInsuranceIndex].cardBackImageUrl} 
                    alt="Insurance Card Back" 
                    className="max-h-40 mx-auto"
                  />
                  <button 
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    onClick={() => handleImageUpload('back', '')}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                // In a real implementation, this would be replaced with a proper file upload component
                <Button 
                  variant="outline" 
                  onClick={() => handleImageUpload('back', 'https://example.com/placeholder-card-back.jpg')}
                >
                  Upload Back
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              variant="primary" 
              onClick={() => setShowUploadModal(false)}
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};