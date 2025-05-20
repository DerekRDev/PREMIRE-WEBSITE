import React from 'react';
import { Card } from '@/ui/design-system/components/Card';
import { Button } from '@/ui/design-system/components/Button';
import { Referral, ReferralStatus } from '@/core/entities/Referral';
import { Patient } from '@/core/entities/Patient';
import { Provider } from '@/core/entities/Provider';

// Status Badge Component reused from ReferralList
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

interface ReferralDetailsProps {
  referral: Referral;
  patient?: Patient;
  referringProvider?: Provider;
  receivingProvider?: Provider;
  isLoading?: boolean;
  onBack: () => void;
  onUpdateStatus?: (referralId: string, newStatus: ReferralStatus) => Promise<void>;
  onScheduleAppointment?: (referralId: string) => void;
}

export const ReferralDetails: React.FC<ReferralDetailsProps> = ({
  referral,
  patient,
  referringProvider,
  receivingProvider,
  isLoading = false,
  onBack,
  onUpdateStatus,
  onScheduleAppointment,
}) => {
  // Format date for display
  const formatDate = (date: Date | string): string => {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Available actions based on current status
  const getAvailableActions = (status: ReferralStatus): ReferralStatus[] => {
    switch (status) {
      case 'DRAFT':
        return ['SUBMITTED'];
      case 'SUBMITTED':
        return ['PROCESSING', 'DECLINED', 'CANCELLED'];
      case 'PROCESSING':
        return ['SCHEDULED', 'COMPLETED', 'DECLINED', 'CANCELLED'];
      case 'SCHEDULED':
        return ['COMPLETED', 'CANCELLED'];
      case 'COMPLETED':
      case 'DECLINED':
      case 'CANCELLED':
        return [];
      default:
        return [];
    }
  };

  // Format status change label
  const getStatusChangeLabel = (status: ReferralStatus): string => {
    switch (status) {
      case 'SUBMITTED': return 'Submit';
      case 'PROCESSING': return 'Mark as Processing';
      case 'SCHEDULED': return 'Mark as Scheduled';
      case 'COMPLETED': return 'Mark as Completed';
      case 'DECLINED': return 'Decline';
      case 'CANCELLED': return 'Cancel';
      default: return status;
    }
  };

  const availableActions = getAvailableActions(referral.status);

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="small"
          onClick={onBack}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          }
        >
          Back to Referrals
        </Button>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Status:</span>
          <StatusBadge status={referral.status} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {/* Main referral information */}
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Referral Details
              </h2>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Referral ID</h3>
                  <p className="mt-1">{referral.id}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created Date</h3>
                  <p className="mt-1">{formatDate(referral.createdAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="mt-1">{formatDate(referral.updatedAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Specialty</h3>
                  <p className="mt-1">{referral.specialtyType}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Urgency Level</h3>
                  <p className="mt-1 capitalize">{referral.urgencyLevel.toLowerCase()}</p>
                </div>
                
                {referral.appointmentId && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Appointment ID</h3>
                    <p className="mt-1">{referral.appointmentId}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500">Reason for Referral</h3>
                <p className="mt-1 whitespace-pre-line">{referral.reason}</p>
              </div>
              
              {referral.notes && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500">Additional Notes</h3>
                  <p className="mt-1 whitespace-pre-line">{referral.notes}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Patient Information */}
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Patient Information
              </h2>
            </div>
            
            <div className="px-6 py-4">
              {patient ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Patient Name</h3>
                    <p className="mt-1">{patient.firstName} {patient.lastName}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                    <p className="mt-1">{patient.dateOfBirth}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="mt-1">{patient.phoneNumber}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1">{patient.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Patient information not available</p>
              )}
            </div>
          </Card>

          {/* Provider Information */}
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Provider Information
              </h2>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Referring Provider */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Referring Provider</h3>
                  {referringProvider ? (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="font-medium">
                        {referringProvider.firstName} {referringProvider.lastName}, {referringProvider.credentials}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {referringProvider.specialties?.join(', ')}
                      </p>
                      <p className="text-sm mt-2">
                        {referringProvider.practiceName}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {referringProvider.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {referringProvider.phone}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Referring provider information not available</p>
                  )}
                </div>
                
                {/* Receiving Provider */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Receiving Provider</h3>
                  {receivingProvider ? (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="font-medium">
                        {receivingProvider.firstName} {receivingProvider.lastName}, {receivingProvider.credentials}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {receivingProvider.specialties?.join(', ')}
                      </p>
                      <p className="text-sm mt-2">
                        {receivingProvider.practiceName}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {receivingProvider.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {receivingProvider.phone}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Receiving provider information not available</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Status History */}
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Status History
              </h2>
            </div>
            
            <div className="px-6 py-4">
              {referral.auditTrail && referral.auditTrail.length > 0 ? (
                <ul className="space-y-4">
                  {referral.auditTrail.map((change, index) => (
                    <li key={index} className="relative pb-4">
                      {/* Timeline connector */}
                      {index < referral.auditTrail.length - 1 && (
                        <div className="absolute top-5 left-3 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></div>
                      )}
                      
                      <div className="relative flex items-start">
                        {/* Status dot */}
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        
                        {/* Status change info */}
                        <div className="ml-4 min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            Status changed from <StatusBadge status={change.fromStatus} /> to <StatusBadge status={change.toStatus} />
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            <span>{formatDate(change.changedAt)}</span>
                            {change.notes && (
                              <p className="mt-1 text-sm text-gray-600">{change.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No status history available</p>
              )}
            </div>
          </Card>

          {/* Actions footer */}
          {(availableActions.length > 0 || 
            (referral.status === 'SUBMITTED' || referral.status === 'PROCESSING')) && (
            <div className="bg-white p-4 rounded-md shadow flex justify-between items-center sticky bottom-0 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {referral.status === 'SUBMITTED' || referral.status === 'PROCESSING' ? 
                  "You can schedule an appointment or update this referral's status." :
                  "Available actions for this referral:"}
              </div>
              
              <div className="flex space-x-2">
                {/* Schedule appointment button */}
                {(referral.status === 'SUBMITTED' || referral.status === 'PROCESSING') && onScheduleAppointment && (
                  <Button
                    variant="outline"
                    onClick={() => onScheduleAppointment(referral.id)}
                  >
                    Schedule Appointment
                  </Button>
                )}
                
                {/* Status change buttons */}
                {availableActions.map((action) => (
                  <Button
                    key={action}
                    variant={action === 'DECLINED' || action === 'CANCELLED' ? 'outline' : 'primary'}
                    className={
                      action === 'DECLINED' || action === 'CANCELLED' 
                        ? 'text-red-500 border-red-300 hover:bg-red-50' 
                        : ''
                    }
                    onClick={() => onUpdateStatus && onUpdateStatus(referral.id, action)}
                  >
                    {getStatusChangeLabel(action)}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};