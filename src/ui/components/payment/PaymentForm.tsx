import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select } from '@/ui/design-system/components';
import { 
  PaymentMethod, 
  ProcessPaymentRequest, 
  ServiceType 
} from '@/core/entities/Payment';

interface PaymentFormProps {
  patientId: string;
  serviceType: ServiceType;
  serviceId?: string;
  appointmentId?: string;
  referralId?: string;
  intakeId?: string;
  originalAmount: number;
  discountedAmount?: number;
  insuranceAmount?: number;
  patientResponsibility: number;
  isDiscountApplied: boolean;
  isInsuranceApplied: boolean;
  onSubmit: (data: ProcessPaymentRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  patientId,
  serviceType,
  serviceId,
  appointmentId,
  referralId,
  intakeId,
  originalAmount,
  discountedAmount,
  insuranceAmount,
  patientResponsibility,
  isDiscountApplied,
  isInsuranceApplied,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [checkNumber, setCheckNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supportsApplePay, setSupportsApplePay] = useState(false);
  const [supportsGooglePay, setSupportsGooglePay] = useState(false);

  // Check for digital wallet support
  useEffect(() => {
    // Check if Apple Pay is supported
    if (window && typeof (window as any).ApplePaySession !== 'undefined') {
      setSupportsApplePay(true);
    }
    
    // Check if Google Pay is supported
    if (window && (window as any).google?.payments) {
      setSupportsGooglePay(true);
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // Basic validation
      if (paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') {
        if (!cardNumber.trim()) {
          throw new Error('Card number is required');
        }
        if (!cardExpiry.trim()) {
          throw new Error('Card expiration date is required');
        }
        if (!cardCvc.trim()) {
          throw new Error('Card security code is required');
        }
      } else if (paymentMethod === 'CHECK') {
        if (!checkNumber.trim()) {
          throw new Error('Check number is required');
        }
      }

      // Build payment request
      const paymentRequest: ProcessPaymentRequest = {
        patientId,
        amount: patientResponsibility,
        paymentMethod,
        serviceType,
        serviceId,
        appointmentId,
        referralId,
        intakeId,
        applyDiscount: isDiscountApplied,
        metadata: {
          ...(paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD' ? {
            lastFour: cardNumber.slice(-4),
            nameOnCard
          } : {}),
          ...(paymentMethod === 'CHECK' ? {
            checkNumber
          } : {}),
          ...(paymentMethod === 'APPLE_PAY' ? {
            digitalWallet: 'APPLE_PAY'
          } : {}),
          ...(paymentMethod === 'GOOGLE_PAY' ? {
            digitalWallet: 'GOOGLE_PAY'
          } : {})
        }
      };

      // Submit the payment
      await onSubmit(paymentRequest);
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsProcessing(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleanValue = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    
    for (let i = 0; i < cleanValue.length; i += 4) {
      parts.push(cleanValue.substring(i, i + 4));
    }
    
    return parts.join(' ');
  };

  // Format card expiry date (MM/YY)
  const formatCardExpiry = (value: string) => {
    const cleanValue = value.replace(/[^0-9]/gi, '');
    
    if (cleanValue.length <= 2) {
      return cleanValue;
    }
    
    return `${cleanValue.substring(0, 2)}/${cleanValue.substring(2, 4)}`;
  };

  // Handle card number change
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  // Handle card expiry change
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardExpiry(e.target.value);
    setCardExpiry(formattedValue);
  };

  // Handle Apple Pay payment
  const handleApplePayment = async () => {
    setPaymentMethod('APPLE_PAY');
    setIsProcessing(true);
    
    try {
      // Simulate Apple Pay flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Submit payment with Apple Pay method
      await onSubmit({
        patientId,
        amount: patientResponsibility,
        paymentMethod: 'APPLE_PAY',
        serviceType,
        serviceId,
        appointmentId,
        referralId,
        intakeId,
        applyDiscount: isDiscountApplied,
        metadata: {
          digitalWallet: 'APPLE_PAY'
        }
      });
    } catch (error) {
      console.error('Apple Pay error:', error);
      setError(error instanceof Error ? error.message : String(error));
      setIsProcessing(false);
    }
  };

  // Handle Google Pay payment
  const handleGooglePayment = async () => {
    setPaymentMethod('GOOGLE_PAY');
    setIsProcessing(true);
    
    try {
      // Simulate Google Pay flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Submit payment with Google Pay method
      await onSubmit({
        patientId,
        amount: patientResponsibility,
        paymentMethod: 'GOOGLE_PAY',
        serviceType,
        serviceId,
        appointmentId,
        referralId,
        intakeId,
        applyDiscount: isDiscountApplied,
        metadata: {
          digitalWallet: 'GOOGLE_PAY'
        }
      });
    } catch (error) {
      console.error('Google Pay error:', error);
      setError(error instanceof Error ? error.message : String(error));
      setIsProcessing(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Payment Information</h2>
      
      {/* Cost breakdown */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-md font-semibold mb-2">Cost Summary</h3>
        <div className="flex justify-between mb-1">
          <span>Original Amount:</span>
          <span>${originalAmount.toFixed(2)}</span>
        </div>
        
        {isDiscountApplied && discountedAmount !== undefined && (
          <div className="flex justify-between mb-1 text-green-600">
            <span>Sliding Fee Discount:</span>
            <span>-${(originalAmount - discountedAmount).toFixed(2)}</span>
          </div>
        )}
        
        {isInsuranceApplied && insuranceAmount !== undefined && (
          <div className="flex justify-between mb-1 text-blue-600">
            <span>Insurance Coverage:</span>
            <span>-${insuranceAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between mt-2 font-bold border-t border-gray-300 pt-2">
          <span>Your Responsibility:</span>
          <span>${patientResponsibility.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Digital wallet options */}
      <div className="mb-6">
        <div className="text-center mb-2">
          <p className="text-sm text-gray-600 mb-3">Express Checkout</p>
          <div className="flex justify-center space-x-4">
            {(supportsApplePay || true) && (
              <button
                type="button"
                onClick={handleApplePayment}
                disabled={isLoading || isProcessing}
                className="relative w-full max-w-[140px] h-10 bg-black text-white rounded-md flex items-center justify-center font-medium transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="white">
                  <path d="M17.72,7.39a4.61,4.61,0,0,0-1.46,3.37,4.59,4.59,0,0,0,2.18,3.68,9.65,9.65,0,0,1-1.51,3c-.91,1.33-1.86,2.65-3.36,2.68s-1.8-.86-3.39-.86-2.08.83-3.39.88S3.81,18.59,2.9,17.26a12.79,12.79,0,0,1-2.85-7c0-4.13,2.71-6.31,5.38-6.31,1.4,0,2.58.94,3.46.94s2.27-1.16,3.83-1.16A5.34,5.34,0,0,1,17.72,7.39Z"/>
                  <path d="M14.49,3.4a4.4,4.4,0,0,0,1,3.27,4.55,4.55,0,0,0,3,1.59,4.65,4.65,0,0,0-1.1-3.31A4.24,4.24,0,0,0,14.49,3.4Z"/>
                </svg>
                <span>Apple Pay</span>
              </button>
            )}
            {(supportsGooglePay || true) && (
              <button
                type="button"
                onClick={handleGooglePayment}
                disabled={isLoading || isProcessing}
                className="relative w-full max-w-[140px] h-10 bg-white border border-gray-300 rounded-md flex items-center justify-center font-medium transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                  <path d="M22.1464 10.128C22.1464 9.51447 22.0796 8.92647 21.9547 8.36396H12.2046V11.6946H17.7364C17.51 12.7946 16.8664 13.7114 15.9146 14.3254V16.4646H19.1882C21.0555 14.7464 22.1464 12.646 22.1464 10.128Z" fill="#4285F4"/>
                  <path d="M12.2046 20.0008C14.956 20.0008 17.2774 19.1548 19.1882 16.4648L15.9146 14.3256C14.9628 15.0008 13.7319 15.3842 12.2046 15.3842C9.49739 15.3842 7.21966 13.6566 6.45511 11.28H3.0683V13.4937C5.03284 17.386 8.70057 20.0008 12.2046 20.0008Z" fill="#34A853"/>
                  <path d="M6.45512 11.2801C6.26239 10.7155 6.16784 10.1155 6.16784 9.50074C6.16784 8.8842 6.26239 8.28601 6.45512 7.72146V5.50781H3.06831C2.38739 6.7746 2 8.19691 2 9.50074C2 10.8046 2.38739 12.2269 3.06831 13.4937L6.45512 11.2801Z" fill="#FBBC05"/>
                  <path d="M12.2046 3.6173C13.6232 3.6173 14.8905 4.10921 15.8878 5.05781L18.691 2.25462C17.2773 0.941911 14.9559 0 12.2046 0C8.70057 0 5.03284 2.61402 3.0683 6.50639L6.45511 8.72003C7.21966 6.34344 9.49739 3.6173 12.2046 3.6173Z" fill="#EA4335"/>
                </svg>
                <span className="text-gray-800">Google Pay</span>
              </button>
            )}
          </div>
          <div className="mt-4 relative">
            <hr className="my-4" />
            <div className="absolute inset-x-0 top-2.5 flex justify-center">
              <span className="bg-white px-3 text-sm text-gray-500">or pay with card</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Payment method selection */}
        <div className="mb-4">
          <Select 
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            required
          >
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="DEBIT_CARD">Debit Card</option>
            <option value="CASH">Cash</option>
            {/* Removed CHECK option as it complicates the streamlined checkout process */}
          </Select>
        </div>
        
        {/* Credit/Debit Card fields */}
        {(paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') && (
          <>
            <div className="mb-4">
              <Input
                label="Name on Card"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                required
                placeholder="John Doe"
              />
            </div>
            
            <div className="mb-4">
              <Input
                label="Card Number"
                value={cardNumber}
                onChange={handleCardNumberChange}
                required
                placeholder="1234 5678 9012 3456"
                maxLength={19} // 16 digits + 3 spaces
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Input
                  label="Expiration Date (MM/YY)"
                  value={cardExpiry}
                  onChange={handleCardExpiryChange}
                  required
                  placeholder="MM/YY"
                  maxLength={5} // MM/YY format
                />
              </div>
              
              <div>
                <Input
                  label="Security Code (CVC)"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                  placeholder="123"
                  maxLength={4}
                  type="password"
                />
              </div>
            </div>

            <div className="mb-4">
              {/* Credit card icons */}
              <div className="flex space-x-2 items-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="18" rx="2" fill="#1434CB" />
                  <path d="M9.5 14.5L10.5 9.5H13L12 14.5H9.5Z" fill="white" />
                  <path d="M14.5 9.5L12 14.5H14.5L17 9.5H14.5Z" fill="white" />
                  <path d="M7 9.5L4.5 12.5L4 14.5H6.5L7 13H8.5L7 9.5Z" fill="white" />
                  <path d="M19.5 14.5L21 9.5H18.5L17 14.5H19.5Z" fill="white" />
                </svg>
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="18" rx="2" fill="#FF5F00" />
                  <circle cx="8" cy="9" r="4" fill="#EB001B" />
                  <circle cx="16" cy="9" r="4" fill="#F79E1B" />
                </svg>
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="18" rx="2" fill="#006FCF" />
                  <path d="M12 4L9 14H15L18 4H12Z" fill="white" />
                </svg>
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="18" rx="2" fill="#0D5079" />
                  <path d="M14 5C11.2386 5 9 7.23858 9 10C9 12.7614 11.2386 15 14 15C16.7614 15 19 12.7614 19 10C19 7.23858 16.7614 5 14 5Z" fill="#FFB600" />
                  <path d="M5 5H8V15H5V5Z" fill="#FFB600" />
                </svg>
              </div>
            </div>
          </>
        )}
        
        {/* Cash message */}
        {paymentMethod === 'CASH' && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded">
            Please pay the cashier at the front desk. You will receive a receipt after payment.
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {/* Security & Info */}
        <div className="mb-6">
          <div className="flex items-center justify-center text-xs text-gray-500 gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure payment - 256-bit SSL encryption</span>
          </div>
        </div>
        
        {/* Form actions */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading || isProcessing}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            isLoading={isLoading || isProcessing}
            disabled={isLoading || isProcessing || paymentMethod === 'CASH'}
            className="px-6"
          >
            {paymentMethod === 'CASH' ? 'Proceed to Cashier' : `Pay $${patientResponsibility.toFixed(2)}`}
          </Button>
        </div>
      </form>
    </Card>
  );
};