import { Appointment, AppointmentRequest } from '../../entities/Appointment';

export interface AppointmentRepository {
  findById(id: string): Promise<Appointment | null>;
  findByPatient(patientId: string): Promise<Appointment[]>;
  findByProvider(providerId: string): Promise<Appointment[]>;
  findByDateRange(startDate: string, endDate: string): Promise<Appointment[]>;
  findUpcoming(patientId: string): Promise<Appointment[]>;
  save(appointment: Appointment): Promise<void>;
  create(request: AppointmentRequest): Promise<Appointment>;
  update(appointment: Appointment): Promise<void>;
  delete(id: string): Promise<void>;
  
  // Additional methods for appointment management
  cancelAppointment(id: string): Promise<void>;
  rescheduleAppointment(
    id: string, 
    newStartTime: string, 
    newEndTime: string
  ): Promise<void>;
  confirmAppointment(id: string): Promise<void>;
  markAsCompleted(id: string): Promise<void>;
  markAsNoShow(id: string): Promise<void>;
}