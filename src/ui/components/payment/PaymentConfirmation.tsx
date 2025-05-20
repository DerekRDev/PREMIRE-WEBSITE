import React from 'react';
import { Card, Button } from '@/ui/design-system/components';
import { Payment } from '@/core/entities/Payment';

interface PaymentConfirmationProps {
  payment: Payment;
  receiptUrl?: string;
  onViewReceipt?: () => void;
  onReturn: () => void;
  onViewAppointment?: () => void;
  onScheduleFollowUp?: () => void;
}

export const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  payment,
  receiptUrl,
  onViewReceipt,
  onReturn,
  onViewAppointment,
  onScheduleFollowUp
}) => {
  // Format date
  const formatDate = (date: Date): string => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card className="max-w-md mx-auto text-center">
      <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
      <p className="text-gray-600 mb-6">
        Thank you for your payment. Your transaction has been completed successfully.
      </p>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="text-gray-500">Receipt Number:</div>
          <div className="font-medium text-right">{payment.receiptNumber || 'N/A'}</div>
          
          <div className="text-gray-500">Transaction ID:</div>
          <div className="font-medium text-right">{payment.transactionId || 'N/A'}</div>
          
          <div className="text-gray-500">Date:</div>
          <div className="font-medium text-right">{formatDate(payment.paymentDate)}</div>
          
          <div className="text-gray-500">Payment Method:</div>
          <div className="font-medium text-right">
            {payment.paymentMethod === 'CREDIT_CARD' && 'Credit Card'}
            {payment.paymentMethod === 'DEBIT_CARD' && 'Debit Card'}
            {payment.paymentMethod === 'CASH' && 'Cash'}
            {payment.paymentMethod === 'CHECK' && 'Check'}
            {payment.paymentMethod === 'BANK_TRANSFER' && 'Bank Transfer'}
            {payment.paymentMethod === 'PAYMENT_PLAN' && 'Payment Plan'}
            {payment.paymentMethod === 'INSURANCE' && 'Insurance'}
            {payment.paymentMethod === 'APPLE_PAY' && 'Apple Pay'}
            {payment.paymentMethod === 'GOOGLE_PAY' && 'Google Pay'}
            {payment.paymentMethod === 'OTHER' && 'Other'}
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-500">Original Amount:</div>
            <div className="font-medium text-right">{formatCurrency(payment.originalAmount)}</div>
            
            {payment.discountApplied && payment.discountedAmount !== undefined && (
              <>
                <div className="text-gray-500">Discount Applied:</div>
                <div className="font-medium text-right text-green-600">
                  -{formatCurrency(payment.originalAmount - payment.discountedAmount)}
                </div>
              </>
            )}
            
            <div className="text-gray-500 font-semibold">Amount Paid:</div>
            <div className="font-bold text-right">{formatCurrency(payment.amount)}</div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 mb-6">
        {receiptUrl && onViewReceipt && (
          <Button onClick={onViewReceipt}>
            View Receipt
          </Button>
        )}
        
        {payment.appointmentId && onViewAppointment && (
          <Button variant="outline" onClick={onViewAppointment}>
            View Appointment Details
          </Button>
        )}
        
        {onScheduleFollowUp && (
          <Button variant="outline" onClick={onScheduleFollowUp}>
            Schedule Follow-up
          </Button>
        )}
      </div>
      
      <div className="text-center">
        <Button variant="text" onClick={onReturn}>
          Return to Dashboard
        </Button>
      </div>
    </Card>
  );
};