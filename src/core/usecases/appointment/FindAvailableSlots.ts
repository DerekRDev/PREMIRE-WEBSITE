import { TimeSlot } from '../../entities/Appointment';
import { Provider } from '../../entities/Provider';
import { ProviderRepository } from '../../interfaces/repositories/ProviderRepository';
import { AppointmentRepository } from '../../interfaces/repositories/AppointmentRepository';

export interface FindAvailableSlotsRequest {
  providerId: string;
  startDate: string;
  endDate: string;
  duration?: number;
  specialtyId?: string;
}

export interface FindAvailableSlotsResponse {
  provider: Provider;
  availableSlots: TimeSlot[];
}

export class FindAvailableSlotsUseCase {
  constructor(
    private readonly providerRepository: ProviderRepository,
    private readonly appointmentRepository: AppointmentRepository
  ) {}

  async execute(request: FindAvailableSlotsRequest): Promise<FindAvailableSlotsResponse> {
    const { providerId, startDate, endDate, duration, specialtyId } = request;

    // Get provider details
    const provider = await this.providerRepository.findById(providerId);
    if (!provider) {
      throw new Error(`Provider not found with ID: ${providerId}`);
    }

    // If specialtyId is provided, verify provider has the specialty
    if (specialtyId && !provider.specialties.some(s => s.id === specialtyId)) {
      throw new Error(`Provider does not have the requested specialty: ${specialtyId}`);
    }

    // Get provider's available slots
    const availableSlots = await this.providerRepository.findAvailableSlots(
      providerId,
      startDate,
      endDate,
      duration
    );

    // Get existing appointments in the date range to exclude those slots
    const existingAppointments = await this.appointmentRepository.findByDateRange(
      startDate,
      endDate
    );

    // Filter out slots that overlap with existing appointments
    const filteredSlots = availableSlots.filter(slot => {
      const hasOverlap = existingAppointments.some(appointment => {
        return (
          slot.startTime < appointment.endTime &&
          slot.endTime > appointment.startTime
        );
      });
      return !hasOverlap;
    });

    // Sort slots by start time
    const sortedSlots = filteredSlots.sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    return {
      provider,
      availableSlots: sortedSlots
    };
  }
}