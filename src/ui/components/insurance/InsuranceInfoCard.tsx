import React from 'react';
import { Card, Button } from '@/ui/design-system/components';
import { InsuranceInfo, InsuranceVerificationStatus } from '@/core/entities/InsuranceInfo';

interface InsuranceInfoCardProps {
  insurance: InsuranceInfo;
  isPrimary?: boolean;
  onEdit?: () => void;
  onVerify?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
}

export const InsuranceInfoCard: React.FC<InsuranceInfoCardProps> = ({
  insurance,
  isPrimary = false,
  onEdit,
  onVerify,
  onDelete,
  onViewDetails
}) => {
  // Format date
  const formatDate = (date?: string | Date): string => {
    if (!date) return 'N/A';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(dateObj);
  };
  
  // Generate verification status badge
  const renderVerificationBadge = (status?: InsuranceVerificationStatus) => {
    if (!status) return null;
    
    // Define styles for different statuses
    const styles = {
      VERIFIED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      FAILED: 'bg-red-100 text-red-800',
      EXPIRED: 'bg-gray-100 text-gray-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      NEEDS_INFORMATION: 'bg-orange-100 text-orange-800'
    };
    
    // Get the style for the current status
    const style = styles[status] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
        {status === 'VERIFIED' && 'Verified'}
        {status === 'PENDING' && 'Verification Pending'}
        {status === 'FAILED' && 'Verification Failed'}
        {status === 'EXPIRED' && 'Expired'}
        {status === 'INACTIVE' && 'Inactive'}
        {status === 'NEEDS_INFORMATION' && 'Needs Information'}
      </span>
    );
  };

  return (
    <Card
      className={`${isPrimary ? 'border-blue-300 bg-blue-50' : ''}`}
      bordered={true}
    >
      {/* Header */}
      <div className="border-b border-gray-200 pb-3 mb-3 flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <h3 className="text-lg font-semibold">{insurance.provider}</h3>
            {isPrimary && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Primary
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {insurance.planName || 'Unknown Plan'}
            {insurance.planType && ` (${insurance.planType})`}
          </p>
        </div>
        
        {renderVerificationBadge(insurance.verificationStatus)}
      </div>
      
      {/* Insurance details */}
      <div className="space-y-2 mb-4">
        <div className="grid grid-cols-2 text-sm">
          <span className="text-gray-500">Member ID:</span>
          <span className="font-medium">{insurance.memberId}</span>
        </div>
        
        {insurance.groupNumber && (
          <div className="grid grid-cols-2 text-sm">
            <span className="text-gray-500">Group Number:</span>
            <span>{insurance.groupNumber}</span>
          </div>
        )}
        
        <div className="grid grid-cols-2 text-sm">
          <span className="text-gray-500">Subscriber:</span>
          <span>
            {insurance.subscriberName || 'Self'}
            {insurance.relationship && insurance.relationship !== 'self' && ` (${insurance.relationship})`}
          </span>
        </div>
        
        {insurance.effectiveDate && (
          <div className="grid grid-cols-2 text-sm">
            <span className="text-gray-500">Effective Date:</span>
            <span>{formatDate(insurance.effectiveDate)}</span>
          </div>
        )}
        
        {insurance.expirationDate && (
          <div className="grid grid-cols-2 text-sm">
            <span className="text-gray-500">Expiration Date:</span>
            <span>{formatDate(insurance.expirationDate)}</span>
          </div>
        )}
        
        {insurance.copay && (
          <div className="mt-3">
            <h4 className="text-sm font-medium mb-1">Copay Information</h4>
            <div className="bg-gray-50 p-2 rounded text-sm">
              {insurance.copay.primaryCare !== undefined && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Primary Care:</span>
                  <span>${insurance.copay.primaryCare}</span>
                </div>
              )}
              
              {insurance.copay.specialist !== undefined && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Specialist:</span>
                  <span>${insurance.copay.specialist}</span>
                </div>
              )}
              
              {insurance.copay.emergency !== undefined && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Emergency:</span>
                  <span>${insurance.copay.emergency}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Insurance card images */}
      {(insurance.cardFrontImageUrl || insurance.cardBackImageUrl) && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Insurance Card</h4>
          <div className="flex space-x-2">
            {insurance.cardFrontImageUrl && (
              <div className="border border-gray-200 rounded overflow-hidden w-1/2">
                <img
                  src={insurance.cardFrontImageUrl}
                  alt="Front of insurance card"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            
            {insurance.cardBackImageUrl && (
              <div className="border border-gray-200 rounded overflow-hidden w-1/2">
                <img
                  src={insurance.cardBackImageUrl}
                  alt="Back of insurance card"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {onEdit && (
          <Button size="small" variant="outline" onClick={onEdit}>
            Edit
          </Button>
        )}
        
        {onVerify && (
          <Button 
            size="small" 
            variant="outline"
            onClick={onVerify}
          >
            Verify Coverage
          </Button>
        )}
        
        {onViewDetails && (
          <Button size="small" onClick={onViewDetails}>
            View Details
          </Button>
        )}
        
        {onDelete && (
          <Button 
            size="small" 
            variant="outline" 
            className="text-red-500 border-red-200 hover:bg-red-50"
            onClick={onDelete}
          >
            Remove
          </Button>
        )}
      </div>
    </Card>
  );
};