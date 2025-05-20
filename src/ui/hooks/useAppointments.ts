import { useState, useCallback } from 'react';

interface TimeSlot {
  startTime: string; // ISO format date-time
  endTime: string;   // ISO format date-time
  providerId: string;
  providerName: string;
  locationId: string;
  locationName: string;
}

interface ScheduleAppointmentParams {
  patientId: string;
  providerId: string;
  startTime: string;
  endTime: string;
  type: string;
  reason: string;
  locationId: string;
  notes?: string;
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
  notes?: string;
  location: {
    id: string;
    name: string;
    address: string;
  };
}

interface UseAppointmentsResult {
  loading: boolean;
  error: Error | null;
  getAvailableSlots: (providerId: string, specialtyId?: string, startDate?: string, endDate?: string) => Promise<TimeSlot[]>;
  scheduleAppointment: (params: ScheduleAppointmentParams) => Promise<Appointment>;
  cancelAppointment: (appointmentId: string) => Promise<boolean>;
}

export const useAppointments = (): UseAppointmentsResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get available appointment slots for a provider
  const getAvailableSlots = useCallback(async (
    providerId: string,
    specialtyId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<TimeSlot[]> => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, we'd call an API that uses the FindAvailableSlots usecase
      // For now, we'll return mock data
      
      // Create dates for the next 7 days
      const result: TimeSlot[] = [];
      const now = new Date();
      
      // Use provided start date or default to tomorrow
      const start = startDate 
        ? new Date(startDate) 
        : new Date(now.setDate(now.getDate() + 1));
      
      // Use provided end date or default to 7 days from start
      const end = endDate
        ? new Date(endDate)
        : new Date(start);
      
      if (!endDate) {
        end.setDate(start.getDate() + 7);
      }
      
      // Generate slots for each day
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        // Only generate slots for weekdays (Mon-Fri)
        const dayOfWeek = date.getDay();
        if (dayOfWeek > 0 && dayOfWeek < 6) {
          // Generate slots from 9am to 4pm, every 30 minutes
          for (let hour = 9; hour < 16; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
              // Skip some slots randomly to simulate unavailability
              if (Math.random() > 0.3) {
                const slotStart = new Date(date);
                slotStart.setHours(hour, minute, 0, 0);
                
                const slotEnd = new Date(slotStart);
                slotEnd.setMinutes(slotEnd.getMinutes() + 30);
                
                result.push({
                  startTime: slotStart.toISOString(),
                  endTime: slotEnd.toISOString(),
                  providerId,
                  providerName: 'Dr. Mock Provider', // In a real app, we'd get the provider name
                  locationId: 'location-1',
                  locationName: 'Main Hospital'
                });
              }
            }
          }
        }
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get available slots');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Schedule an appointment
  const scheduleAppointment = useCallback(async (
    params: ScheduleAppointmentParams
  ): Promise<Appointment> => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, we'd call an API that uses the ScheduleAppointment usecase
      // For now, we'll simulate a response
      
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const appointment: Appointment = {
        id: `appt-${Date.now()}`,
        patientId: params.patientId,
        providerId: params.providerId,
        providerName: 'Dr. Mock Provider', // In a real app, we'd get the provider name
        startTime: params.startTime,
        endTime: params.endTime,
        type: params.type,
        reason: params.reason,
        notes: params.notes,
        location: {
          id: params.locationId,
          name: 'Main Hospital', // In a real app, we'd get the location name
          address: '123 Medical Center Dr, City, State 12345'
        }
      };
      
      return appointment;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to schedule appointment');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel an appointment
  const cancelAppointment = useCallback(async (
    appointmentId: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, we'd call an API to cancel the appointment
      // For now, we'll simulate success
      
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to cancel appointment');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getAvailableSlots,
    scheduleAppointment,
    cancelAppointment
  };
};