import React from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import Image from 'next/image';

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  profileImage?: string;
  specialties: string[];
}

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
  provider?: Provider;
}

export interface AppointmentConfirmationProps {
  appointment: Appointment;
  onReschedule?: () => void;
  onClose?: () => void;
  className?: string;
}

export const AppointmentConfirmation: React.FC<AppointmentConfirmationProps> = ({
  appointment,
  onReschedule,
  onClose,
  className = '',
}) => {
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const formatTime = (isoTime: string): string => {
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatAppointmentType = (type: string): string => {
    switch (type) {
      case 'INITIAL': return 'Initial Visit';
      case 'FOLLOW_UP': return 'Follow-up';
      case 'PHYSICAL': return 'Annual Physical';
      case 'CONSULTATION': return 'Consultation';
      case 'PROCEDURE': return 'Procedure';
      default: return type;
    }
  };

  const formatSpecialty = (text: string): string => {
    return text
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <Card className="p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-neutral-800 mb-2">
            Appointment Confirmed
          </h2>
          <p className="text-neutral-600">
            Your appointment has been successfully scheduled.
          </p>
        </div>

        {appointment.provider && (
          <div className="mb-8 p-6 bg-blue-50/50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {appointment.provider.profileImage ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-white shadow-md">
                    <Image
                      src={appointment.provider.profileImage}
                      alt={`${appointment.provider.firstName} ${appointment.provider.lastName}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 text-xl font-medium ring-2 ring-white shadow-md">
                    {appointment.provider.firstName.charAt(0)}{appointment.provider.lastName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {appointment.provider.firstName} {appointment.provider.lastName}
                </h3>
                <p className="text-gray-600">{appointment.provider.title}</p>
                {appointment.provider.specialties && appointment.provider.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {appointment.provider.specialties.slice(0, 2).map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                      >
                        {formatSpecialty(specialty)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="border border-neutral-200 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-neutral-500 mb-2">Date</p>
              <p className="text-lg font-semibold text-neutral-800">
                {formatDate(appointment.startTime)}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-neutral-500 mb-2">Time</p>
              <p className="text-lg font-semibold text-neutral-800">
                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-neutral-500 mb-2">Provider</p>
              <p className="text-lg font-semibold text-neutral-800">
                {appointment.providerName}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-neutral-500 mb-2">Type</p>
              <p className="text-lg font-semibold text-neutral-800">
                {formatAppointmentType(appointment.type)}
              </p>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-neutral-500 mb-2">Location</p>
              <p className="text-lg font-semibold text-neutral-800">
                {appointment.location.name}
              </p>
              <p className="text-sm text-neutral-600">
                {appointment.location.address}
              </p>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-neutral-500 mb-2">Reason</p>
              <p className="text-lg font-semibold text-neutral-800">
                {appointment.reason}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 mb-8 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-3">Important Information</h3>
          
          <div className="flex items-start gap-3 text-neutral-600 text-sm">
            <svg className="w-5 h-5 mt-0.5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Please arrive 15 minutes early to complete paperwork.</span>
          </div>
          
          <div className="flex items-start gap-3 text-neutral-600 text-sm">
            <svg className="w-5 h-5 mt-0.5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>A confirmation has been sent to your email.</span>
          </div>
          
          <div className="flex items-start gap-3 text-neutral-600 text-sm">
            <svg className="w-5 h-5 mt-0.5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Please cancel at least 24 hours in advance to avoid fees.</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {onReschedule && (
            <Button
              variant="outline"
              onClick={onReschedule}
              className="sm:flex-1"
            >
              Reschedule
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