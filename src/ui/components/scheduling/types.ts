import { Appointment, TimeSlot, AppointmentType, AppointmentStatus } from '../../../core/entities/Appointment';
import { Provider, Specialty } from '../../../core/entities/Provider';

// UI-specific interfaces
export interface UIProvider {
  id: string;
  name: string;
  specialties: Specialty[];
  locations: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  }[];
  schedule: {
    workingHours: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      breakStart?: string;
      breakEnd?: string;
    }[];
    blockedTimes: TimeSlot[];
  };
  email: string;
  phone: string;
  imageUrl?: string;
  biography?: string;
  education?: string[];
  languages?: string[];
}

export interface SpecialtySelectionProps {
  specialties: Specialty[];
  selectedSpecialty: Specialty | null;
  onSelect: (specialtyId: string) => void | Promise<void>;
  className?: string;
}

export interface ProviderSearchProps {
  specialty: Specialty | null;
  selectedProvider: UIProvider | null;
  onSelectProvider: (provider: UIProvider) => void | Promise<void>;
  providers?: UIProvider[];
  className?: string;
}

export interface DateTimeSelectionProps {
  provider: UIProvider;
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void | Promise<void>;
  className?: string;
}

// Extended appointment type for UI display
export class UIAppointment extends Appointment {
  constructor(
    id: string,
    patientId: string,
    providerId: string,
    locationId: string,
    startTime: string,
    endTime: string,
    status: AppointmentStatus,
    type: AppointmentType,
    reason: string,
    public readonly providerName: string,
    public readonly location: {
      id: string;
      name: string;
      address: string;
    },
    notes?: string
  ) {
    super(
      id,
      patientId,
      providerId,
      locationId,
      startTime,
      endTime,
      status,
      type,
      reason,
      notes
    );
  }

  static fromAppointment(
    appointment: Appointment,
    providerName: string,
    location: { id: string; name: string; address: string }
  ): UIAppointment {
    return new UIAppointment(
      appointment.id,
      appointment.patientId,
      appointment.providerId,
      appointment.locationId,
      appointment.startTime,
      appointment.endTime,
      appointment.status,
      appointment.type,
      appointment.reason,
      providerName,
      location,
      appointment.notes
    );
  }
}

export interface AppointmentConfirmationProps {
  appointment: UIAppointment;
  onClose?: () => void;
  onReschedule?: () => void;
  className?: string;
}

export interface AppointmentSchedulerContainerProps {
  className?: string;
  onComplete?: () => void;
  onCancel?: () => void;
}

export interface AppointmentDetailsFormProps {
  appointmentType: AppointmentType | null;
  reason: string;
  notes: string;
  onTypeChange: (type: AppointmentType) => void;
  onReasonChange: (reason: string) => void;
  onNotesChange: (notes: string) => void;
  className?: string;
}

// Helper function to convert domain Provider to UIProvider
export function toUIProvider(provider: Provider): UIProvider {
  return {
    id: provider.id,
    name: provider.name,
    specialties: provider.specialties,
    locations: provider.locations,
    schedule: provider.getSchedule(),
    email: provider.email,
    phone: provider.phone,
    imageUrl: provider.imageUrl,
    biography: provider.biography,
    education: provider.education,
    languages: provider.languages
  };
}

// Simple provider interface for compatibility with AppointmentScheduler
export interface SimpleProvider {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  specialties: string[];
  profileImage?: string;
  rating?: number;
  availabilityStatus?: string;
  nextAvailable?: string;
  bio?: string;
  education?: string[];
  languages?: string[];
  yearsOfExperience?: number;
  acceptingNewPatients?: boolean;
  locations: {
    id: string;
    name: string;
    address: string;
    distance?: number;
  }[];
}

// Helper function to convert SimpleProvider to UIProvider
export function simpleProviderToUIProvider(provider: SimpleProvider): UIProvider {
  return {
    id: provider.id,
    name: `${provider.firstName} ${provider.lastName}`,
    specialties: provider.specialties.map(s => ({ id: s, name: s, description: '' })),
    locations: provider.locations.map(l => ({
      id: l.id,
      name: l.name,
      address: l.address,
      city: '',
      state: '',
      zipCode: '',
      phone: ''
    })),
    schedule: {
      workingHours: [{
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00'
      }],
      blockedTimes: []
    },
    email: '',
    phone: '',
    imageUrl: provider.profileImage,
    biography: provider.bio,
    education: provider.education,
    languages: provider.languages
  };
}