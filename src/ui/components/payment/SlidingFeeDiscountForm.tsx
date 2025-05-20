import React, { useState } from 'react';
import { Card, Button, Input, Select } from '@/ui/design-system/components';
import { 
  ApplyForDiscountRequest, 
  IncomeVerificationType 
} from '@/core/entities/SlidingFeeDiscount';

interface SlidingFeeDiscountFormProps {
  patientId: string;
  onSubmit: (data: ApplyForDiscountRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  onSkip?: () => void;
}

// Income document type options
const incomeDocumentTypes: { value: IncomeVerificationType; label: string }[] = [
  { value: 'PAY_STUB', label: 'Pay Stub (last 30 days)' },
  { value: 'TAX_RETURN', label: 'Tax Return (most recent)' },
  { value: 'W2', label: 'W-2 Form' },
  { value: 'SOCIAL_SECURITY', label: 'Social Security Benefits Letter' },
  { value: 'UNEMPLOYMENT', label: 'Unemployment Benefits Statement' },
  { value: 'DISABILITY', label: 'Disability Benefits Statement' },
  { value: 'SELF_EMPLOYMENT', label: 'Self-Employment Income Documentation' },
  { value: 'BANK_STATEMENT', label: 'Bank Statement (last 30 days)' },
  { value: 'EMPLOYER_LETTER', label: 'Employer Verification Letter' },
  { value: 'OTHER', label: 'Other Documentation' }
];

export const SlidingFeeDiscountForm: React.FC<SlidingFeeDiscountFormProps> = ({
  patientId,
  onSubmit,
  onCancel,
  isLoading = false,
  onSkip
}) => {
  // Form state
  const [householdSize, setHouseholdSize] = useState<number>(1);
  const [annualIncome, setAnnualIncome] = useState<string>('');
  const [documentType, setDocumentType] = useState<IncomeVerificationType>('PAY_STUB');
  const [notes, setNotes] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ type: IncomeVerificationType; url?: string }[]>([]);
  const [showFplEstimate, setShowFplEstimate] = useState<boolean>(false);
  const [fplEstimate, setFplEstimate] = useState<number | null>(null);

  // Handle file upload (mock implementation)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    
    // Mock file upload
    setTimeout(() => {
      const mockUrl = `https://storage.example.com/documents/${Date.now()}-${e.target.files![0].name}`;
      
      setUploadedFiles([
        ...uploadedFiles,
        { type: documentType, url: mockUrl }
      ]);
      
      setIsUploading(false);
    }, 1500);
  };

  // Calculate FPL estimate
  const calculateFplEstimate = () => {
    if (!annualIncome || householdSize < 1) return;
    
    const income = parseFloat(annualIncome);
    if (isNaN(income)) return;
    
    // 2024 FPL base amounts
    const fplBase = 14580; // For household of 1
    const fplAdditional = 5140; // For each additional person
    
    const householdFpl = fplBase + (householdSize - 1) * fplAdditional;
    const percentage = (income / householdFpl) * 100;
    
    setFplEstimate(Math.round(percentage));
    setShowFplEstimate(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);
    
    try {
      const income = parseFloat(annualIncome);
      
      if (isNaN(income)) {
        throw new Error('Please enter a valid annual income');
      }
      
      if (uploadedFiles.length === 0) {
        throw new Error('Please upload at least one income verification document');
      }
      
      // Build discount application request
      const request: ApplyForDiscountRequest = {
        patientId,
        householdSize,
        annualIncome: income,
        verificationDocuments: uploadedFiles,
        notes
      };
      
      // Submit the application
      await onSubmit(request);
    } catch (error) {
      console.error('Application error:', error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-2">Sliding Fee Discount Application</h2>
      <p className="text-gray-600 mb-6">
        Premier Healthcare offers discounts based on household size and income.
        Please provide the information below to determine if you qualify.
      </p>
      
      <form onSubmit={handleSubmit}>
        {/* Household size */}
        <div className="mb-4">
          <Input
            type="number"
            min={1}
            max={20}
            label="Household Size (including yourself)"
            value={householdSize.toString()}
            onChange={(e) => setHouseholdSize(parseInt(e.target.value) || 1)}
            required
          />
        </div>
        
        {/* Annual income */}
        <div className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="text"
                label="Annual Household Income"
                value={annualIncome}
                onChange={(e) => {
                  // Only allow numbers and decimal point
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  setAnnualIncome(value);
                  setShowFplEstimate(false);
                }}
                required
                placeholder="45000"
                inputPrefix="$"
              />
            </div>
            <div className="self-end mb-1">
              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={calculateFplEstimate}
                disabled={!annualIncome || isNaN(parseFloat(annualIncome))}
              >
                Estimate FPL
              </Button>
            </div>
          </div>
          
          {showFplEstimate && fplEstimate !== null && (
            <div className={`mt-2 p-2 text-sm rounded ${
              fplEstimate <= 200 
                ? 'bg-green-50 text-green-700'
                : 'bg-gray-50 text-gray-700'
            }`}>
              {fplEstimate <= 100 && (
                <>You are at <strong>{fplEstimate}%</strong> of the Federal Poverty Level. You likely qualify for the maximum discount (Tier 1).</>
              )}
              {fplEstimate > 100 && fplEstimate <= 133 && (
                <>You are at <strong>{fplEstimate}%</strong> of the Federal Poverty Level. You likely qualify for a significant discount (Tier 2).</>
              )}
              {fplEstimate > 133 && fplEstimate <= 166 && (
                <>You are at <strong>{fplEstimate}%</strong> of the Federal Poverty Level. You likely qualify for a moderate discount (Tier 3).</>
              )}
              {fplEstimate > 166 && fplEstimate <= 200 && (
                <>You are at <strong>{fplEstimate}%</strong> of the Federal Poverty Level. You likely qualify for a small discount (Tier 4).</>
              )}
              {fplEstimate > 200 && (
                <>You are at <strong>{fplEstimate}%</strong> of the Federal Poverty Level, which is above the 200% threshold for discount eligibility.</>
              )}
            </div>
          )}
        </div>
        
        {/* Income verification documents */}
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">Income Verification Documents</h3>
          <p className="text-sm text-gray-600 mb-3">
            Please upload at least one document that verifies your household income.
          </p>
          
          <div className="mb-3">
            <Select
              label="Document Type"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as IncomeVerificationType)}
            >
              {incomeDocumentTypes.map((doc) => (
                <option key={doc.value} value={doc.value}>
                  {doc.label}
                </option>
              ))}
            </Select>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Document
            </label>
            <div className="mt-1 flex items-center">
              <label className="cursor-pointer flex w-full items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                <span>
                  {isUploading ? 'Uploading...' : 'Choose File'}
                </span>
                <input
                  type="file"
                  className="sr-only"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
          
          {/* List of uploaded files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Uploaded Documents</h4>
              <ul className="text-sm border rounded-md divide-y divide-gray-200">
                {uploadedFiles.map((file, index) => {
                  // Find the document type label
                  const docTypeLabel = incomeDocumentTypes.find(
                    (doc) => doc.value === file.type
                  )?.label || file.type;
                  
                  return (
                    <li key={index} className="p-3 flex justify-between items-center">
                      <span className="text-gray-700">{docTypeLabel}</span>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => {
                          setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
                        }}
                      >
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        
        {/* Additional notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes (Optional)
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional information about your household income situation"
          />
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {/* Info message about verification */}
        <div className="mb-6 p-3 bg-blue-50 text-blue-700 rounded text-sm">
          <p className="font-medium mb-1">Important Information:</p>
          <ul className="list-disc list-inside">
            <li>Your application will be reviewed within 1-2 business days.</li>
            <li>If approved, the discount will be valid for one year.</li>
            <li>You must notify us if your income or household size changes.</li>
            <li>All information provided is kept confidential.</li>
          </ul>
        </div>
        
        {/* Form actions */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="text"
            onClick={onSkip || onCancel}
          >
            {onSkip ? 'Skip for Now' : 'Cancel'}
          </Button>
          
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading || isProcessing}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              isLoading={isLoading || isProcessing}
              disabled={isLoading || isProcessing || uploadedFiles.length === 0}
            >
              Submit Application
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};