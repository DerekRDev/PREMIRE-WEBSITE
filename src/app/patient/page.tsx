'use client';

import { useState, useEffect } from 'react';
import { usePatient, useAppointments } from '@/ui/hooks';
import { PatientDashboard } from '@/ui/components/patient';
import { Appointment } from '@/core/entities/Appointment';
import { useRouter } from 'next/navigation';

export default function PatientPage() {
  const router = useRouter();
  const { patient, getPatient, loading: patientLoading } = usePatient();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch patient data on initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we'd get the patient ID from authentication
        // For now, use a mock ID
        const patientId = 'patient-123';
        await getPatient(patientId);
        
        // Generate some mock appointments for demo purposes
        const mockAppointments: Appointment[] = [
          {
            id: 'appt-1',
            patientId: patientId,
            providerId: 'provider-1',
            startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
            endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 30 minutes later
            status: 'CONFIRMED',
            type: 'Follow-up Visit',
            reason: 'Follow-up on recent lab results',
            location: {
              id: 'location-1',
              name: 'Main Hospital',
              address: '123 Medical Center Dr, City, State 12345'
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'appt-2',
            patientId: patientId,
            providerId: 'provider-2',
            startTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
            endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(), // 45 minutes later
            status: 'SCHEDULED',
            type: 'Annual Physical',
            reason: 'Yearly check-up',
            location: {
              id: 'location-2',
              name: 'North Clinic',
              address: '456 Health Pkwy, City, State 12345'
            },
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        
        setAppointments(mockAppointments);
      } catch (err) {
        console.error('Failed to fetch patient data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [getPatient]);

  // Navigation handlers
  const handleScheduleAppointment = () => {
    router.push('/appointments');
  };
  
  const handleViewAppointmentDetails = (appointmentId: string) => {
    router.push(`/appointments/${appointmentId}`);
  };
  
  const handleViewAllAppointments = () => {
    router.push('/patient/appointments');
  };

  if (isLoading || patientLoading || !patient) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <span className="ml-4 text-neutral-600">Loading patient information...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PatientDashboard
        patient={patient}
        upcomingAppointments={appointments}
        onScheduleAppointment={handleScheduleAppointment}
        onViewAppointmentDetails={handleViewAppointmentDetails}
        onViewAllAppointments={handleViewAllAppointments}
      />
    </div>
  );
}