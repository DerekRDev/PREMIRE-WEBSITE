import React, { useState } from 'react';
import { Button } from '@/ui/design-system/components/Button';
import { Card } from '@/ui/design-system/components/Card';
import { Input } from '@/ui/design-system/components/Input';
import { Select } from '@/ui/design-system/components/Select';
import { CreateReferralRequest, UrgencyLevel } from '@/core/entities/Referral';
import { Provider } from '@/core/entities/Provider';

interface ReferralFormProps {
  patientId?: string;
  referringProviderId?: string;
  onSubmit: (data: CreateReferralRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  providers?: Provider[];
  specialtyOptions?: string[];
}

export const ReferralForm: React.FC<ReferralFormProps> = ({
  patientId = '',
  referringProviderId = '',
  onSubmit,
  onCancel,
  isLoading = false,
  providers = [],
  specialtyOptions = [
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Oncology',
    'Orthopedics',
    'Pulmonology',
    'Rheumatology',
    'Urology',
  ],
}) => {
  const [formData, setFormData] = useState<CreateReferralRequest>({
    patientId,
    referringProviderId,
    receivingProviderId: '',
    specialtyType: '',
    reason: '',
    notes: '',
    urgencyLevel: 'ROUTINE' as UrgencyLevel,
    documentIds: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.patientId) {
      newErrors.patientId = 'Patient is required';
    }
    
    if (!formData.referringProviderId) {
      newErrors.referringProviderId = 'Referring provider is required';
    }
    
    if (!formData.receivingProviderId) {
      newErrors.receivingProviderId = 'Receiving provider is required';
    }
    
    if (!formData.specialtyType) {
      newErrors.specialtyType = 'Specialty is required';
    }
    
    if (!formData.reason) {
      newErrors.reason = 'Reason for referral is required';
    }

    if (!formData.urgencyLevel) {
      newErrors.urgencyLevel = 'Urgency level is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when the user makes changes
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting referral:', error);
      
      // Display error message
      setErrors({
        submit: 'Failed to submit referral. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create New Referral</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Patient ID field (usually pre-filled or hidden) */}
        <div className="mb-4">
          <Input
            label="Patient ID"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            disabled={!!patientId}
            error={errors.patientId}
            required
          />
        </div>
        
        {/* Referring Provider field (usually pre-filled) */}
        <div className="mb-4">
          <Select
            label="Referring Provider"
            name="referringProviderId"
            value={formData.referringProviderId}
            onChange={handleChange}
            disabled={!!referringProviderId}
            error={errors.referringProviderId}
            required
          >
            <option value="">Select Referring Provider</option>
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.firstName} {provider.lastName}, {provider.credentials}
              </option>
            ))}
          </Select>
        </div>
        
        {/* Specialty Type */}
        <div className="mb-4">
          <Select
            label="Specialty"
            name="specialtyType"
            value={formData.specialtyType}
            onChange={handleChange}
            error={errors.specialtyType}
            required
          >
            <option value="">Select Specialty</option>
            {specialtyOptions.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </Select>
        </div>
        
        {/* Receiving Provider */}
        <div className="mb-4">
          <Select
            label="Receiving Provider"
            name="receivingProviderId"
            value={formData.receivingProviderId}
            onChange={handleChange}
            error={errors.receivingProviderId}
            required
          >
            <option value="">Select Receiving Provider</option>
            {providers
              .filter((provider) => 
                // Only show providers in the selected specialty
                !formData.specialtyType || 
                provider.specialties?.includes(formData.specialtyType)
              )
              .map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.firstName} {provider.lastName}, {provider.credentials}
                </option>
              ))}
          </Select>
        </div>
        
        {/* Urgency Level */}
        <div className="mb-4">
          <Select
            label="Urgency Level"
            name="urgencyLevel"
            value={formData.urgencyLevel}
            onChange={handleChange}
            error={errors.urgencyLevel}
            required
          >
            <option value="ROUTINE">Routine</option>
            <option value="URGENT">Urgent</option>
            <option value="EMERGENCY">Emergency</option>
          </Select>
        </div>
        
        {/* Reason for Referral */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Referral*
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              errors.reason ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.reason && (
            <p className="mt-1 text-sm text-red-500">{errors.reason}</p>
          )}
        </div>
        
        {/* Additional Notes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* File Attachments (placeholder for future implementation) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attach Documents
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">Documents, images or scanned reports (PDF, JPEG, PNG)</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" disabled />
            </label>
          </div> 
          <p className="mt-1 text-xs text-gray-500">Document upload will be available in a future release</p>
        </div>
        
        {/* Global submit error */}
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
            {errors.submit}
          </div>
        )}
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading || isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading || isSubmitting}
            disabled={isLoading || isSubmitting}
          >
            Submit Referral
          </Button>
        </div>
      </form>
    </Card>
  );
};