import { Provider, Schedule, Specialty } from '../../entities/Provider';
import { TimeSlot } from '../../entities/Appointment';

export interface ProviderRepository {
  findById(id: string): Promise<Provider | null>;
  findBySpecialty(specialtyId: string): Promise<Provider[]>;
  findByLocation(locationId: string): Promise<Provider[]>;
  findAll(): Promise<Provider[]>;
  save(provider: Provider): Promise<void>;
  update(provider: Provider): Promise<void>;
  delete(id: string): Promise<void>;

  // Schedule management
  getSchedule(providerId: string): Promise<Schedule>;
  updateSchedule(providerId: string, schedule: Schedule): Promise<void>;
  blockTimeSlot(providerId: string, slot: TimeSlot): Promise<void>;
  unblockTimeSlot(providerId: string, slot: TimeSlot): Promise<void>;
  
  // Availability methods
  findAvailableSlots(
    providerId: string,
    startDate: string,
    endDate: string,
    duration?: number
  ): Promise<TimeSlot[]>;
  
  isAvailable(
    providerId: string,
    slot: TimeSlot
  ): Promise<boolean>;

  // Specialty management
  addSpecialty(providerId: string, specialty: Specialty): Promise<void>;
  removeSpecialty(providerId: string, specialtyId: string): Promise<void>;
  
  // Search and filter methods
  search(query: string): Promise<Provider[]>;
  findByFilters(filters: {
    specialties?: string[];
    locations?: string[];
    languages?: string[];
    availability?: {
      startDate: string;
      endDate: string;
    };
  }): Promise<Provider[]>;
}