import React from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import { Patient } from '../../../core/entities/Patient';
import { Appointment } from '../../../core/entities/Appointment';

interface UpcomingAppointment {
  id: string;
  date: string; // ISO date string
  provider: string;
  specialty: string;
  location: string;
}

export interface PatientDashboardProps {
  patient: Patient;
  upcomingAppointments: Appointment[];
  onScheduleAppointment: () => void;
  onViewAppointmentDetails: (appointmentId: string) => void;
  onViewAllAppointments: () => void;
  className?: string;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  patient,
  upcomingAppointments,
  onScheduleAppointment,
  onViewAppointmentDetails,
  onViewAllAppointments,
  className = '',
}) => {
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Format time for display
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">
            Welcome back, {patient.firstName}!
          </h1>
          <p className="text-neutral-600 mt-1">
            Here's an overview of your healthcare information.
          </p>
        </div>
        
        <Button variant="primary" onClick={onScheduleAppointment}>
          Schedule Appointment
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-neutral-800">
              Upcoming Appointments
            </h2>
            
            <Button
              variant="text"
              onClick={onViewAllAppointments}
              className="text-sm"
            >
              View All
            </Button>
          </div>
          
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <p>You don't have any upcoming appointments.</p>
              <Button
                variant="outline"
                onClick={onScheduleAppointment}
                className="mt-4"
              >
                Schedule Now
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 3).map(appointment => (
                <div
                  key={appointment.id}
                  className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-neutral-800">
                        {appointment.type}
                      </h3>
                      <p className="text-sm text-neutral-600 mt-1">
                        {formatDate(appointment.startTime)} at {formatTime(appointment.startTime)}
                      </p>
                      <p className="text-sm text-neutral-500 mt-1">
                        {appointment.location.name}
                      </p>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewAppointmentDetails(appointment.id)}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            Quick Actions
          </h2>
          
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={onScheduleAppointment}
              className="w-full justify-start"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule Appointment
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Medical Records
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Message Your Provider
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Prescription Refills
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Update Insurance
            </Button>
          </div>
          
          <div className="mt-6 pt-4 border-t border-neutral-200">
            <h3 className="text-base font-medium text-neutral-800 mb-2">
              Need Help?
            </h3>
            <p className="text-sm text-neutral-600">
              Contact our patient support team:
            </p>
            <p className="text-sm font-medium text-neutral-800 mt-1">
              (555) 123-4567
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};