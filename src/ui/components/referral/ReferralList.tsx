import React from 'react';
import { Card } from '@/ui/design-system/components/Card';
import { Button } from '@/ui/design-system/components/Button';
import { Referral, ReferralStatus } from '@/core/entities/Referral';

// Status Badge Component
const StatusBadge: React.FC<{ status: ReferralStatus }> = ({ status }) => {
  const statusConfig = {
    DRAFT: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
    SUBMITTED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Submitted' },
    PROCESSING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Processing' },
    SCHEDULED: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Scheduled' },
    COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
    DECLINED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Declined' },
    CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelled' },
  };

  const config = statusConfig[status] || statusConfig.DRAFT;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

// Urgency Badge Component
const UrgencyBadge: React.FC<{ urgency: Referral['urgencyLevel'] }> = ({ urgency }) => {
  const urgencyConfig = {
    ROUTINE: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Routine' },
    URGENT: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Urgent' },
    EMERGENCY: { bg: 'bg-red-100', text: 'text-red-800', label: 'Emergency' },
  };

  const config = urgencyConfig[urgency] || urgencyConfig.ROUTINE;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

interface ReferralListProps {
  referrals: Referral[];
  isLoading?: boolean;
  onViewDetails: (referralId: string) => void;
  onCreateNew?: () => void;
  showCreateButton?: boolean;
  emptyMessage?: string;
}

export const ReferralList: React.FC<ReferralListProps> = ({
  referrals,
  isLoading = false,
  onViewDetails,
  onCreateNew,
  showCreateButton = true,
  emptyMessage = 'No referrals found',
}) => {
  // Format date for display
  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <h2 className="text-lg font-semibold text-gray-900">Referrals</h2>
        {showCreateButton && onCreateNew && (
          <Button 
            size="small"
            onClick={onCreateNew}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            Create New
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : referrals.length === 0 ? (
        <div className="text-center py-8 px-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Referrals</h3>
          <p className="mt-1 text-sm text-gray-500">{emptyMessage}</p>
          {showCreateButton && onCreateNew && (
            <div className="mt-6">
              <Button 
                size="small"
                onClick={onCreateNew}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
              >
                Create New Referral
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialty
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urgency
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {referrals.map((referral) => (
                <tr 
                  key={referral.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onViewDetails(referral.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(referral.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {referral.specialtyType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={referral.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <UrgencyBadge urgency={referral.urgencyLevel} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button
                      size="small"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(referral.id);
                      }}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};