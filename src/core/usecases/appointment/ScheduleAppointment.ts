import { Appointment } from '../../entities/Appointment';
import { AppointmentRepository } from '../../interfaces/repositories/AppointmentRepository';
import { PatientRepository } from '../../interfaces/repositories/PatientRepository';
import { ProviderRepository } from '../../interfaces/repositories/ProviderRepository';

export interface ScheduleAppointmentRequest {
  patientId: string;
  providerId: string;
  startTime: string; // ISO format date-time
  endTime: string;   // ISO format date-time
  type: string;      // e.g., "INITIAL", "FOLLOW_UP", "PHYSICAL", etc.
  reason: string;    // The reason for the appointment
  locationId: string;
  notes?: string;    // Optional notes about the appointment
}

export class ScheduleAppointment {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly patientRepository: PatientRepository,
    private readonly providerRepository: ProviderRepository
  ) {}

  async execute(request: ScheduleAppointmentRequest): Promise<Appointment> {
    const {
      patientId,
      providerId,
      startTime,
      endTime,
      type,
      reason,
      locationId,
      notes
    } = request;

    // Validate that patient exists
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) {
      throw new Error(`Patient with id ${patientId} not found`);
    }

    // Validate that provider exists
    const provider = await this.providerRepository.findById(providerId);
    if (!provider) {
      throw new Error(`Provider with id ${providerId} not found`);
    }

    // Validate that the provider has the specified location
    const location = provider.locations.find(loc => loc.id === locationId);
    if (!location) {
      throw new Error(`Location with id ${locationId} not found for this provider`);
    }

    // Check if the provider is available at the requested time
    const isAvailable = await this.isProviderAvailableAt(
      providerId,
      startTime,
      endTime
    );

    if (!isAvailable) {
      throw new Error('Provider is not available at the requested time');
    }

    // Create the appointment
    const appointment = await this.appointmentRepository.create({
      patientId,
      providerId,
      startTime,
      endTime,
      status: 'SCHEDULED',
      type,
      reason,
      notes,
      location: {
        id: location.id,
        name: location.name,
        address: location.address
      }
    });

    return appointment;
  }

  // Helper method to check if a provider is available
  private async isProviderAvailableAt(
    providerId: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    // Get the day of the week
    const daysOfWeek = [
      'sunday', 'monday', 'tuesday', 'wednesday',
      'thursday', 'friday', 'saturday'
    ] as const;
    
    const dayOfWeek = daysOfWeek[start.getDay()];
    
    // Check provider's general availability for this day
    const provider = await this.providerRepository.findById(providerId);
    if (!provider || !provider.availability) {
      return false;
    }
    
    const dayAvailability = provider.availability[dayOfWeek];
    if (!dayAvailability || dayAvailability.length === 0) {
      return false; // Provider doesn't work on this day
    }
    
    // Extract just time portion from the datetime
    const startHour = start.getHours();
    const startMinute = start.getMinutes();
    const endHour = end.getHours();
    const endMinute = end.getMinutes();
    
    // Check if time falls within any of the provider's work periods
    const isWithinWorkHours = dayAvailability.some(period => {
      const periodStartHour = parseInt(period.startTime.split(':')[0]);
      const periodStartMinute = parseInt(period.startTime.split(':')[1]);
      const periodEndHour = parseInt(period.endTime.split(':')[0]);
      const periodEndMinute = parseInt(period.endTime.split(':')[1]);
      
      // Create comparable numeric values (hours * 100 + minutes)
      const timeStart = startHour * 100 + startMinute;
      const timeEnd = endHour * 100 + endMinute;
      const periodStart = periodStartHour * 100 + periodStartMinute;
      const periodEnd = periodEndHour * 100 + periodEndMinute;
      
      return timeStart >= periodStart && timeEnd <= periodEnd;
    });
    
    if (!isWithinWorkHours) {
      return false;
    }
    
    // Check for conflicts with existing appointments
    const existingAppointments = await this.appointmentRepository.findByProviderAndDateRange(
      providerId,
      start.toISOString().split('T')[0], // Just the date part
      end.toISOString().split('T')[0]    // Just the date part
    );
    
    // Check if any existing appointment overlaps with the requested time
    const hasConflict = existingAppointments.some(appointment => {
      const appointmentStart = new Date(appointment.startTime);
      const appointmentEnd = new Date(appointment.endTime);
      
      // Check for overlap
      return (
        (start >= appointmentStart && start < appointmentEnd) ||
        (end > appointmentStart && end <= appointmentEnd) ||
        (start <= appointmentStart && end >= appointmentEnd)
      );
    });
    
    return !hasConflict;
  }
}