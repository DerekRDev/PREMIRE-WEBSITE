import React from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';

interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  providerName: string;
  startTime: string;
  endTime: string;
  type: string;
  reason: string;
  location: {
    id: string;
    name: string;
    address: string;
  };
}

export interface AppointmentConfirmationProps {
  appointment: Appointment;
  onReschedule?: () => void;
  onCancel?: () => void;
  className?: string;
}

export const AppointmentConfirmation: React.FC<AppointmentConfirmationProps> = ({
  appointment,
  onReschedule,
  onCancel,
  className = '',
}) => {
  // Format date for display
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Format time for display
  const formatTime = (isoTime: string): string => {
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  };
  
  return (
    <div className={`max-w-lg mx-auto ${className}`}>
      <Card className="p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-neutral-800">
            Appointment Confirmed
          </h2>
          <p className="text-neutral-600 mt-1">
            Your appointment has been successfully scheduled.
          </p>
        </div>
        
        <div className="border-t border-b border-neutral-200 py-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-500 mb-1">Date</p>
              <p className="font-medium text-neutral-800">
                {formatDate(appointment.startTime)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-500 mb-1">Time</p>
              <p className="font-medium text-neutral-800">
                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-500 mb-1">Provider</p>
              <p className="font-medium text-neutral-800">
                {appointment.providerName}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-500 mb-1">Type</p>
              <p className="font-medium text-neutral-800">
                {appointment.type}
              </p>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-sm text-neutral-500 mb-1">Location</p>
              <p className="font-medium text-neutral-800">
                {appointment.location.name}
              </p>
              <p className="text-sm text-neutral-600">
                {appointment.location.address}
              </p>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-sm text-neutral-500 mb-1">Reason</p>
              <p className="font-medium text-neutral-800">
                {appointment.reason}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center text-neutral-600 text-sm">
            <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Please arrive 15 minutes early to complete paperwork.</span>
          </div>
          
          <div className="flex items-center text-neutral-600 text-sm">
            <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>A confirmation has been sent to your email.</span>
          </div>
          
          <div className="flex items-center text-neutral-600 text-sm">
            <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Please cancel at least 24 hours in advance to avoid fees.</span>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {onReschedule && (
            <Button
              variant="outline"
              onClick={onReschedule}
              className="sm:flex-1"
            >
              Reschedule
            </Button>
          )}
          
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              className="text-red-600 border-red-600 hover:bg-red-50 sm:flex-1"
            >
              Cancel
            </Button>
          )}
          
          <Button
            variant="primary"
            onClick={() => window.print()}
            className="sm:flex-1"
          >
            Print Details
          </Button>
        </div>
      </Card>
    </div>
  );
};