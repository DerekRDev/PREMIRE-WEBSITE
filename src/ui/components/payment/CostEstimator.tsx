import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select } from '@/ui/design-system/components';

interface CostEstimatorProps {
  patientId: string;
  serviceType: string;
  originalAmount: number;
  insuranceId?: string;
  householdSize?: number;
  annualIncome?: number;
  onEstimate: (options: {
    patientId: string;
    serviceType: string;
    originalAmount: number;
    insuranceId?: string;
    householdSize?: number;
    annualIncome?: number;
  }) => Promise<{
    originalAmount: number;
    discountedAmount?: number;
    estimatedInsurancePayment?: number;
    estimatedPatientResponsibility: number;
    discountApplied: boolean;
    insuranceApplied: boolean;
    savingsAmount: number;
    savingsPercentage: number;
    message: string;
  }>;
  showSlidingFeeForm?: boolean;
  onApplyForSlidingFee?: () => void;
  isLoading?: boolean;
}

export const CostEstimator: React.FC<CostEstimatorProps> = ({
  patientId,
  serviceType,
  originalAmount,
  insuranceId,
  householdSize,
  annualIncome,
  onEstimate,
  showSlidingFeeForm = true,
  onApplyForSlidingFee,
  isLoading = false
}) => {
  // State
  const [formHouseholdSize, setFormHouseholdSize] = useState<number>(householdSize || 1);
  const [formAnnualIncome, setFormAnnualIncome] = useState<string>(annualIncome?.toString() || '');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showDisclaimerDetails, setShowDisclaimerDetails] = useState<boolean>(false);
  const [estimateResult, setEstimateResult] = useState<{
    originalAmount: number;
    discountedAmount?: number;
    estimatedInsurancePayment?: number;
    estimatedPatientResponsibility: number;
    discountApplied: boolean;
    insuranceApplied: boolean;
    savingsAmount: number;
    savingsPercentage: number;
    message: string;
  } | null>(null);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Calculate the estimate
  const calculateEstimate = async () => {
    setIsCalculating(true);
    
    try {
      const result = await onEstimate({
        patientId,
        serviceType,
        originalAmount,
        insuranceId,
        householdSize: annualIncome ? formHouseholdSize : undefined,
        annualIncome: formAnnualIncome ? parseFloat(formAnnualIncome) : undefined
      });
      
      setEstimateResult(result);
    } catch (error) {
      console.error('Error calculating estimate:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Calculate estimate on initial load if we have all the data
  useEffect(() => {
    if ((insuranceId || (householdSize && annualIncome)) && !estimateResult) {
      calculateEstimate();
    }
  }, []);

  return (
    <Card className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Cost Estimate</h2>
      
      {/* Original cost */}
      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">Original Cost:</div>
        <div className="text-2xl font-bold">{formatCurrency(originalAmount)}</div>
      </div>
      
      {/* Estimate result */}
      {estimateResult && (
        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-md font-semibold mb-2">Estimated Patient Responsibility</h3>
            
            <div className="text-2xl font-bold text-blue-600 mb-3">
              {formatCurrency(estimateResult.estimatedPatientResponsibility)}
            </div>
            
            <div className="text-sm text-gray-600 mb-2">
              {estimateResult.message}
            </div>
            
            {(estimateResult.discountApplied || estimateResult.insuranceApplied) && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-sm font-medium mb-1">Savings Breakdown:</div>
                
                <div className="space-y-1">
                  {estimateResult.discountApplied && estimateResult.discountedAmount !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span>Sliding Fee Discount:</span>
                      <span className="font-medium text-green-600">
                        -{formatCurrency(originalAmount - estimateResult.discountedAmount)}
                      </span>
                    </div>
                  )}
                  
                  {estimateResult.insuranceApplied && estimateResult.estimatedInsurancePayment && (
                    <div className="flex justify-between text-sm">
                      <span>Insurance Coverage:</span>
                      <span className="font-medium text-blue-600">
                        -{formatCurrency(estimateResult.estimatedInsurancePayment)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm font-medium pt-1">
                    <span>Total Savings:</span>
                    <span className="text-green-600">
                      {formatCurrency(estimateResult.savingsAmount)} 
                      ({Math.round(estimateResult.savingsPercentage)}%)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Sliding fee discount form */}
      {showSlidingFeeForm && !estimateResult?.discountApplied && (
        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="text-md font-semibold mb-2">Sliding Fee Discount</h3>
            <p className="text-sm mb-4">
              Premier Healthcare offers discounts based on household size and income.
              Check if you qualify for our Sliding Fee Discount Program.
            </p>
            
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Household Size"
                  type="number"
                  min={1}
                  value={formHouseholdSize.toString()}
                  onChange={(e) => setFormHouseholdSize(parseInt(e.target.value) || 1)}
                />
                
                <Input
                  label="Annual Household Income"
                  value={formAnnualIncome}
                  onChange={(e) => {
                    // Allow only numbers and decimal point
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    setFormAnnualIncome(value);
                  }}
                  inputPrefix="$"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={calculateEstimate}
                isLoading={isCalculating}
                disabled={isCalculating || !formAnnualIncome || isNaN(parseFloat(formAnnualIncome))}
              >
                Check Eligibility
              </Button>
              
              {onApplyForSlidingFee && (
                <Button
                  onClick={onApplyForSlidingFee}
                >
                  Apply for Discount
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Disclaimer */}
      <div className="text-xs text-gray-500">
        <button 
          className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
          onClick={() => setShowDisclaimerDetails(!showDisclaimerDetails)}
        >
          <span className="mr-1">
            {showDisclaimerDetails ? '▼' : '►'}
          </span>
          Important information about this estimate
        </button>
        
        {showDisclaimerDetails && (
          <div className="bg-gray-50 p-3 rounded text-xs">
            <p className="mb-2">
              This is only an estimate based on the information provided. Your actual costs may vary depending on:
            </p>
            <ul className="list-disc list-inside mb-2">
              <li>Actual services provided during your visit</li>
              <li>Changes to your insurance coverage or benefits</li>
              <li>Additional tests or procedures that may be necessary</li>
              <li>Final verification of your sliding fee discount eligibility</li>
            </ul>
            <p>
              For questions about your estimate, please contact our billing department at (555) 123-4567.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};