'use client';

import React, { useState } from 'react';
import { CostEstimator } from '@/ui/components/payment';
import { Card, Button, Select, Input } from '@/ui/design-system/components';

export default function CostEstimatePage() {
  const [serviceType, setServiceType] = useState('PRIMARY_CARE');
  const [amount, setAmount] = useState('150');
  const [hasInsurance, setHasInsurance] = useState(true);
  const [ready, setReady] = useState(false);
  
  const handleCalculateEstimate = async (options: any) => {
    // Simulate API call to get cost estimate
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock estimate result
    if (options.householdSize && options.annualIncome) {
      const income = options.annualIncome;
      const householdSize = options.householdSize;
      
      // Calculate FPL percentage (simplified)
      const fplBase = 14580; // 2024 base amount for household of 1
      const fplExtra = 5140; // Amount for each additional person
      const householdFPL = fplBase + (householdSize - 1) * fplExtra;
      const fplPercentage = (income / householdFPL) * 100;
      
      // Determine discount tier based on FPL percentage
      let discountPercentage = 0;
      if (fplPercentage <= 100) {
        discountPercentage = 80; // Tier 1
      } else if (fplPercentage <= 133) {
        discountPercentage = 60; // Tier 2
      } else if (fplPercentage <= 166) {
        discountPercentage = 40; // Tier 3
      } else if (fplPercentage <= 200) {
        discountPercentage = 20; // Tier 4
      }
      
      // Calculate discounted amount
      const orig = parseFloat(amount);
      const discounted = orig - (orig * discountPercentage / 100);
      
      // Calculate insurance contribution if applicable
      let insurancePayment = 0;
      let patientResponsibility = discounted;
      
      if (hasInsurance) {
        if (serviceType === 'PRIMARY_CARE') {
          insurancePayment = discounted - 30; // $30 copay
          patientResponsibility = 30;
        } else if (serviceType === 'SPECIALIST') {
          insurancePayment = discounted - 50; // $50 copay
          patientResponsibility = 50;
        } else {
          // Apply 20% coinsurance for other services
          insurancePayment = discounted * 0.8;
          patientResponsibility = discounted * 0.2;
        }
      }
      
      return {
        originalAmount: orig,
        discountedAmount: discounted,
        estimatedInsurancePayment: hasInsurance ? insurancePayment : undefined,
        estimatedPatientResponsibility: patientResponsibility,
        discountApplied: discountPercentage > 0,
        insuranceApplied: hasInsurance,
        savingsAmount: orig - patientResponsibility,
        savingsPercentage: ((orig - patientResponsibility) / orig) * 100,
        message: `Your estimated cost includes a ${discountPercentage}% sliding fee discount${hasInsurance ? ' and insurance coverage' : ''}.`
      };
    } else if (hasInsurance) {
      // Insurance only, no sliding fee
      const orig = parseFloat(amount);
      let insurancePayment = 0;
      let patientResponsibility = orig;
      
      if (serviceType === 'PRIMARY_CARE') {
        insurancePayment = orig - 30; // $30 copay
        patientResponsibility = 30;
      } else if (serviceType === 'SPECIALIST') {
        insurancePayment = orig - 50; // $50 copay
        patientResponsibility = 50;
      } else {
        // Apply 20% coinsurance for other services
        insurancePayment = orig * 0.8;
        patientResponsibility = orig * 0.2;
      }
      
      return {
        originalAmount: orig,
        estimatedInsurancePayment: insurancePayment,
        estimatedPatientResponsibility: patientResponsibility,
        discountApplied: false,
        insuranceApplied: true,
        savingsAmount: orig - patientResponsibility,
        savingsPercentage: ((orig - patientResponsibility) / orig) * 100,
        message: 'Your estimated cost includes insurance coverage.'
      };
    } else {
      // No insurance, no sliding fee
      const orig = parseFloat(amount);
      return {
        originalAmount: orig,
        estimatedPatientResponsibility: orig,
        discountApplied: false,
        insuranceApplied: false,
        savingsAmount: 0,
        savingsPercentage: 0,
        message: 'No discounts or insurance coverage applied.'
      };
    }
  };
  
  const handleApplyForSlidingFee = () => {
    window.location.href = '/financial-assistance';
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Cost Estimate</h1>
      
      {!ready ? (
        <Card className="max-w-xl mx-auto mb-6">
          <h2 className="text-lg font-semibold mb-4">Service Information</h2>
          
          <div className="space-y-4 mb-6">
            <Select
              label="Service Type"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            >
              <option value="PRIMARY_CARE">Primary Care Visit</option>
              <option value="SPECIALIST">Specialist Visit</option>
              <option value="PROCEDURE">Medical Procedure</option>
              <option value="IMAGING">Imaging (X-ray, MRI, etc.)</option>
              <option value="LABORATORY">Laboratory Tests</option>
              <option value="DENTAL">Dental Services</option>
            </Select>
            
            <Input
              label="Estimated Cost"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              inputPrefix="$"
            />
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Do you have insurance?
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-blue-600"
                    checked={hasInsurance}
                    onChange={() => setHasInsurance(true)}
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-blue-600"
                    checked={!hasInsurance}
                    onChange={() => setHasInsurance(false)}
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => setReady(true)}>
              Get Estimate
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <Button
            variant="outline"
            className="mb-4"
            onClick={() => setReady(false)}
          >
            Change Service Details
          </Button>
          
          <CostEstimator
            patientId="patient-123"
            serviceType={serviceType}
            originalAmount={parseFloat(amount)}
            insuranceId={hasInsurance ? 'ins-bcbs-123' : undefined}
            onEstimate={handleCalculateEstimate}
            onApplyForSlidingFee={handleApplyForSlidingFee}
          />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Ready to proceed with your appointment?
            </p>
            <Button>
              Schedule Appointment
            </Button>
          </div>
        </>
      )}
    </div>
  );
}