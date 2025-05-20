'use client';

import React, { useState } from 'react';
import { PaymentForm, PaymentConfirmation } from '@/ui/components/payment';

export default function PaymentsPage() {
  const [payment, setPayment] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Mock data for demo
  const mockServiceData = {
    patientId: 'patient-123',
    serviceType: 'APPOINTMENT',
    serviceId: 'service-456',
    originalAmount: 150,
    patientResponsibility: 75,
    isDiscountApplied: true,
    isInsuranceApplied: true,
  };
  
  const handleSubmitPayment = async (paymentData: any) => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create mock payment result
    const mockPayment = {
      id: `payment-${Date.now()}`,
      patientId: mockServiceData.patientId,
      amount: mockServiceData.patientResponsibility,
      originalAmount: mockServiceData.originalAmount,
      discountApplied: mockServiceData.isDiscountApplied,
      currency: 'USD',
      status: 'COMPLETED',
      paymentMethod: paymentData.paymentMethod,
      paymentDate: new Date(),
      lastUpdated: new Date(),
      transactionId: `tx-${Math.random().toString(36).substring(2, 10)}`,
      receiptNumber: `REC-${Date.now()}`,
      serviceType: mockServiceData.serviceType,
    };
    
    setPayment(mockPayment);
    setShowConfirmation(true);
  };
  
  const handleReturn = () => {
    // Reset state
    setPayment(null);
    setShowConfirmation(false);
  };
  
  const handleCancel = () => {
    // Just go back to dashboard
    alert('Payment cancelled');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Payment</h1>
      
      {showConfirmation ? (
        <PaymentConfirmation
          payment={payment}
          receiptUrl="https://example.com/receipt"
          onReturn={handleReturn}
          onViewReceipt={() => window.open('https://example.com/receipt', '_blank')}
        />
      ) : (
        <PaymentForm
          patientId={mockServiceData.patientId}
          serviceType={mockServiceData.serviceType as any}
          serviceId={mockServiceData.serviceId}
          originalAmount={mockServiceData.originalAmount}
          discountedAmount={mockServiceData.isDiscountApplied ? 100 : undefined}
          insuranceAmount={mockServiceData.isInsuranceApplied ? 50 : undefined}
          patientResponsibility={mockServiceData.patientResponsibility}
          isDiscountApplied={mockServiceData.isDiscountApplied}
          isInsuranceApplied={mockServiceData.isInsuranceApplied}
          onSubmit={handleSubmitPayment}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}