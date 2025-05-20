export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  startTime: string; // ISO format date-time
  endTime: string; // ISO format date-time
  status: AppointmentStatus;
  type: string;
  reason: string;
  notes?: string;
  location: {
    id: string;
    name: string;
    address: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type AppointmentStatus = 
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';