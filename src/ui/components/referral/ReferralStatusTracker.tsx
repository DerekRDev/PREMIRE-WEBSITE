import React from 'react';
import { Card } from '@/ui/design-system/components/Card';
import { Referral, ReferralStatus } from '@/core/entities/Referral';

interface ReferralStatusTrackerProps {
  referral: Referral;
  isCompact?: boolean;
}

export const ReferralStatusTracker: React.FC<ReferralStatusTrackerProps> = ({
  referral,
  isCompact = false,
}) => {
  // Define the status flow for normal progression
  const standardStatusFlow: ReferralStatus[] = [
    'SUBMITTED',
    'PROCESSING',
    'SCHEDULED',
    'COMPLETED'
  ];

  // Find the current status index
  const currentStatusIndex = standardStatusFlow.indexOf(referral.status);
  
  // Handle non-standard statuses (DECLINED, CANCELLED, DRAFT)
  const isNonStandardStatus = currentStatusIndex === -1;

  // Format date for display
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Find the date when a status was reached
  const getStatusDate = (status: ReferralStatus): string => {
    // Reverse the array to find the most recent status change to this status
    const statusChange = [...referral.auditTrail]
      .reverse()
      .find(change => change.toStatus === status);
    
    return statusChange ? formatDate(statusChange.changedAt) : '';
  };

  // Define status labels and descriptions
  const statusInfo = {
    SUBMITTED: {
      label: 'Submitted',
      description: 'Referral has been submitted to the receiving provider',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    PROCESSING: {
      label: 'Processing',
      description: 'Referral is being reviewed by the receiving provider',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    SCHEDULED: {
      label: 'Scheduled',
      description: 'Appointment has been scheduled',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    COMPLETED: {
      label: 'Completed',
      description: 'The referral has been completed',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    DECLINED: {
      label: 'Declined',
      description: 'The referral was declined by the receiving provider',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    },
    CANCELLED: {
      label: 'Cancelled',
      description: 'The referral was cancelled',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      )
    },
    DRAFT: {
      label: 'Draft',
      description: 'Referral has been saved as a draft',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    }
  };

  // If the status is non-standard, render a simpler view
  if (isNonStandardStatus) {
    return (
      <Card className={isCompact ? 'p-4' : 'p-6'}>
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${referral.status === 'DECLINED' || referral.status === 'CANCELLED' ? 'text-red-500' : 'text-gray-500'}`}>
            {statusInfo[referral.status]?.icon || (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="ml-4">
            <h3 className={`font-medium ${referral.status === 'DECLINED' || referral.status === 'CANCELLED' ? 'text-red-500' : 'text-gray-900'}`}>
              {statusInfo[referral.status]?.label || referral.status}
            </h3>
            {!isCompact && (
              <p className="text-sm text-gray-500 mt-1">
                {statusInfo[referral.status]?.description || ''}
                {getStatusDate(referral.status) && ` (${getStatusDate(referral.status)})`}
              </p>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // For standard statuses, render a progress tracker
  return (
    <Card className={isCompact ? 'p-4' : 'p-6'}>
      <h3 className={isCompact ? 'text-sm font-medium mb-3' : 'text-base font-medium mb-4'}>
        Referral Status
      </h3>
      
      <div className="relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
          <div 
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
            style={{ width: `${Math.max(5, (currentStatusIndex + 1) * 25)}%` }}
          ></div>
        </div>

        <div className={`flex ${isCompact ? 'justify-between' : 'justify-between'}`}>
          {standardStatusFlow.map((status, index) => {
            const isActive = index <= currentStatusIndex;
            const statusDate = getStatusDate(status);
            
            return (
              <div 
                key={status} 
                className={`${isCompact ? 'flex-1' : 'flex-1'} text-center`}
              >
                <div className="relative">
                  <div className={`
                    w-6 h-6 mx-auto rounded-full flex items-center justify-center
                    ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}
                  `}>
                    {statusInfo[status]?.icon || index + 1}
                  </div>
                  
                  <div className={`mt-2 ${isCompact ? 'text-xs' : 'text-sm'} ${isActive ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                    {statusInfo[status]?.label || status}
                  </div>
                  
                  {!isCompact && statusDate && (
                    <div className="mt-1 text-xs text-gray-500">
                      {statusDate}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};