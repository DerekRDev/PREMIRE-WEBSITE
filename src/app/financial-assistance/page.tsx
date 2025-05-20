'use client';

import React, { useState } from 'react';
import { SlidingFeeDiscountForm } from '@/ui/components/payment';
import { Card, Button } from '@/ui/design-system/components';

export default function FinancialAssistancePage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async (data: any) => {
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitted(true);
  };
  
  const handleCancel = () => {
    alert('Application cancelled');
  };
  
  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Sliding Fee Discount Application</h1>
        
        <Card className="max-w-lg mx-auto text-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for submitting your Sliding Fee Discount application. We will review your application and notify you of the decision within 1-2 business days.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <p className="font-medium mb-2">Next Steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Your application will be reviewed by our financial services team</li>
              <li>You may be contacted if additional information is needed</li>
              <li>Once approved, your discount will be applied to all eligible services</li>
              <li>Your discount will be valid for one year</li>
            </ol>
          </div>
          
          <Button onClick={() => window.location.href = '/'}>
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sliding Fee Discount Application</h1>
      
      <div className="mb-6">
        <p className="text-gray-700">
          Premier Healthcare is committed to providing healthcare services to all patients regardless of ability to pay.
          Our Sliding Fee Discount Program offers discounted fees for patients who qualify based on household size and income.
        </p>
      </div>
      
      <SlidingFeeDiscountForm
        patientId="patient-123"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}