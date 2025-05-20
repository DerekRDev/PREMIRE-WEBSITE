import { Provider, TimeSlot } from '../../entities/Provider';
import { ProviderRepository } from '../../interfaces/repositories/ProviderRepository';
import { AppointmentRepository } from '../../interfaces/repositories/AppointmentRepository';

export interface AvailabilitySlot {
  startTime: string; // ISO format date-time
  endTime: string;   // ISO format date-time
  providerId: string;
  providerName: string;
  locationId: string;
  locationName: string;
}

export interface FindAvailableSlotsRequest {
  startDate: string;        // ISO format date
  endDate: string;          // ISO format date
  specialty?: string;       // Optional specialty filter
  locationId?: string;      // Optional location filter
  duration?: number;        // Duration in minutes, default is 30
}

export class FindAvailableSlots {
  constructor(
    private readonly providerRepository: ProviderRepository,
    private readonly appointmentRepository: AppointmentRepository
  ) {}

  async execute(request: FindAvailableSlotsRequest): Promise<AvailabilitySlot[]> {
    const {
      startDate,
      endDate,
      specialty,
      locationId,
      duration = 30 // Default slot duration is 30 minutes
    } = request;

    // Find available providers based on criteria
    const providers = await this.providerRepository.findAvailable(
      startDate,
      endDate,
      specialty,
      locationId
    );

    // Get existing appointments for these providers in the date range
    const allProviderIds = providers.map(provider => provider.id);
    
    const existingAppointments = [];
    for (const providerId of allProviderIds) {
      const appointments = await this.appointmentRepository.findByProviderAndDateRange(
        providerId,
        startDate,
        endDate
      );
      existingAppointments.push(...appointments);
    }

    // Generate all available slots
    const availableSlots: AvailabilitySlot[] = [];
    
    for (const provider of providers) {
      const providerAppointments = existingAppointments.filter(
        appointment => appointment.providerId === provider.id
      );
      
      // Get available slots for each day in the range
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      
      for (let date = new Date(startDateObj); date <= endDateObj; date.setDate(date.getDate() + 1)) {
        const dayOfWeek = this.getDayOfWeek(date);
        
        // Skip if provider doesn't work this day
        if (!provider.availability || !provider.availability[dayOfWeek].length) {
          continue;
        }
        
        // Get day's working hours
        const workingHours = provider.availability[dayOfWeek];
        
        // Generate slots for each working hour period
        for (const hours of workingHours) {
          const slots = this.generateTimeSlots(date, hours, duration);
          
          // Filter out slots that overlap with existing appointments
          const availableDaySlots = this.filterAvailableSlots(
            slots,
            providerAppointments,
            provider
          );
          
          availableSlots.push(...availableDaySlots);
        }
      }
    }
    
    return availableSlots;
  }
  
  // Helper method to get day of week string from date
  private getDayOfWeek(date: Date): keyof Provider['availability'] {
    const days: (keyof Provider['availability'])[] = [
      'sunday', 'monday', 'tuesday', 'wednesday', 
      'thursday', 'friday', 'saturday'
    ];
    return days[date.getDay()];
  }
  
  // Generate time slots for a day given working hours and duration
  private generateTimeSlots(date: Date, hours: TimeSlot, durationMinutes: number): Array<{ start: Date, end: Date }> {
    const slots: Array<{ start: Date, end: Date }> = [];
    
    // Parse working hours
    const startHour = parseInt(hours.startTime.split(':')[0]);
    const startMinute = parseInt(hours.startTime.split(':')[1]);
    const endHour = parseInt(hours.endTime.split(':')[0]);
    const endMinute = parseInt(hours.endTime.split(':')[1]);
    
    // Create start and end datetime
    const startDateTime = new Date(date);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    
    const endDateTime = new Date(date);
    endDateTime.setHours(endHour, endMinute, 0, 0);
    
    // Generate slots
    for (
      let slotStart = new Date(startDateTime);
      slotStart < endDateTime;
      slotStart = new Date(slotStart.getTime() + durationMinutes * 60 * 1000)
    ) {
      const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000);
      
      // Make sure we don't go past end time
      if (slotEnd <= endDateTime) {
        slots.push({
          start: slotStart,
          end: slotEnd
        });
      }
    }
    
    return slots;
  }
  
  // Filter out slots that overlap with existing appointments
  private filterAvailableSlots(
    slots: Array<{ start: Date, end: Date }>,
    appointments: any[],
    provider: Provider
  ): AvailabilitySlot[] {
    return slots
      .filter(slot => {
        // Check if slot overlaps with any appointment
        return !appointments.some(appointment => {
          const appointmentStart = new Date(appointment.startTime);
          const appointmentEnd = new Date(appointment.endTime);
          
          // Check for overlap
          return (
            (slot.start >= appointmentStart && slot.start < appointmentEnd) ||
            (slot.end > appointmentStart && slot.end <= appointmentEnd) ||
            (slot.start <= appointmentStart && slot.end >= appointmentEnd)
          );
        });
      })
      .map(slot => {
        // Use first location if no specific one is given
        const location = provider.locations[0];
        
        return {
          startTime: slot.start.toISOString(),
          endTime: slot.end.toISOString(),
          providerId: provider.id,
          providerName: `${provider.firstName} ${provider.lastName}`,
          locationId: location.id,
          locationName: location.name
        };
      });
  }
}