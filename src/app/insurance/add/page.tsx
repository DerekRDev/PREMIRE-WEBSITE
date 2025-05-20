'use client';

import React, { useState } from 'react';
import { InsuranceCardScanner, InsuranceInfoCard } from '@/ui/components/insurance';
import { Card, Button, Input, Select } from '@/ui/design-system/components';

export default function AddInsurancePage() {
  const [step, setStep] = useState<'form' | 'scan' | 'review' | 'complete'>('form');
  const [insuranceInfo, setInsuranceInfo] = useState<any>({
    provider: '',
    planName: '',
    planType: 'PPO',
    memberId: '',
    groupNumber: '',
    subscriberName: '',
    relationship: 'self',
    isPrimary: true,
  });
  const [cardImages, setCardImages] = useState<{ front?: string; back?: string }>({});
  
  const handleScanCard = () => {
    setStep('scan');
  };
  
  const handleCardCapture = (frontImage: string, backImage?: string) => {
    setCardImages({
      front: frontImage,
      back: backImage
    });
    
    // Simulate OCR processing that would extract info from the card
    // In a real app, this would call the InsuranceVerificationService
    setTimeout(() => {
      setInsuranceInfo({
        ...insuranceInfo,
        provider: 'Blue Cross Blue Shield',
        planName: 'PPO 80/20',
        memberId: 'XYZ123456789',
        groupNumber: 'G9876543',
        cardFrontImageUrl: frontImage,
        cardBackImageUrl: backImage
      });
      setStep('review');
    }, 2000);
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInsuranceInfo({
      ...insuranceInfo,
      [name]: value
    });
  };
  
  const handleSaveInsurance = () => {
    // This would save the insurance info to the database
    // For demo purposes, just show confirmation
    setStep('complete');
  };
  
  const renderForm = () => (
    <Card>
      <h2 className="text-xl font-bold mb-4">Add Insurance Information</h2>
      
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="mb-4">
          <Input
            label="Insurance Provider"
            name="provider"
            value={insuranceInfo.provider}
            onChange={handleInputChange}
            required
            placeholder="e.g. Blue Cross Blue Shield"
          />
        </div>
        
        <div className="mb-4">
          <Input
            label="Plan Name"
            name="planName"
            value={insuranceInfo.planName}
            onChange={handleInputChange}
            placeholder="e.g. PPO 80/20"
          />
        </div>
        
        <div className="mb-4">
          <Select
            label="Plan Type"
            name="planType"
            value={insuranceInfo.planType}
            onChange={handleInputChange}
          >
            <option value="PPO">PPO</option>
            <option value="HMO">HMO</option>
            <option value="EPO">EPO</option>
            <option value="POS">POS</option>
            <option value="HDHP">HDHP</option>
            <option value="MEDICARE">Medicare</option>
            <option value="MEDICAID">Medicaid</option>
          </Select>
        </div>
        
        <div className="mb-4">
          <Input
            label="Member ID"
            name="memberId"
            value={insuranceInfo.memberId}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="mb-4">
          <Input
            label="Group Number"
            name="groupNumber"
            value={insuranceInfo.groupNumber}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="mb-4">
          <Input
            label="Subscriber Name"
            name="subscriberName"
            value={insuranceInfo.subscriberName}
            onChange={handleInputChange}
            placeholder="Leave blank if self"
          />
        </div>
        
        <div className="mb-4">
          <Select
            label="Relationship to Subscriber"
            name="relationship"
            value={insuranceInfo.relationship}
            onChange={handleInputChange}
          >
            <option value="self">Self</option>
            <option value="spouse">Spouse</option>
            <option value="child">Child</option>
            <option value="other">Other</option>
          </Select>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPrimary"
              name="isPrimary"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={insuranceInfo.isPrimary}
              onChange={(e) => setInsuranceInfo({ ...insuranceInfo, isPrimary: e.target.checked })}
            />
            <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-900">
              This is my primary insurance
            </label>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={handleScanCard}>
            Scan Insurance Card
          </Button>
          
          <Button type="submit">
            Continue
          </Button>
        </div>
      </form>
    </Card>
  );
  
  const renderScan = () => (
    <InsuranceCardScanner
      onCapture={handleCardCapture}
      onCancel={() => setStep('form')}
    />
  );
  
  const renderReview = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Review Insurance Information</h2>
      
      <InsuranceInfoCard
        insurance={{
          ...insuranceInfo,
          id: 'temp-id',
          verificationStatus: 'PENDING',
          createdAt: new Date(),
          updatedAt: new Date()
        }}
        isPrimary={insuranceInfo.isPrimary}
      />
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep('form')}
        >
          Edit Information
        </Button>
        
        <Button onClick={handleSaveInsurance}>
          Save Insurance
        </Button>
      </div>
    </div>
  );
  
  const renderComplete = () => (
    <Card className="text-center">
      <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Insurance Added Successfully!</h2>
      <p className="text-gray-600 mb-6">
        Your insurance information has been added and will be verified with your provider.
      </p>
      
      <Button onClick={() => window.location.href = '/'}>
        Return to Dashboard
      </Button>
    </Card>
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add Insurance</h1>
      
      {step === 'form' && renderForm()}
      {step === 'scan' && renderScan()}
      {step === 'review' && renderReview()}
      {step === 'complete' && renderComplete()}
    </div>
  );
}