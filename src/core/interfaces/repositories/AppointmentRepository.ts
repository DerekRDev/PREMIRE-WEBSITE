import { Appointment } from '../../entities/Appointment';

export interface AppointmentRepository {
  findById(id: string): Promise<Appointment | null>;
  findAll(): Promise<Appointment[]>;
  findByPatientId(patientId: string): Promise<Appointment[]>;
  findByProviderId(providerId: string): Promise<Appointment[]>;
  findUpcoming(limit?: number): Promise<Appointment[]>;
  findByDateRange(startDate: string, endDate: string): Promise<Appointment[]>;
  findByProviderAndDateRange(providerId: string, startDate: string, endDate: string): Promise<Appointment[]>;
  create(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment>;
  update(id: string, appointment: Partial<Appointment>): Promise<Appointment>;
  updateStatus(id: string, status: Appointment['status']): Promise<Appointment>;
  delete(id: string): Promise<boolean>;
}