export interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  specialties: string[];
  npi: string;
  profileImage?: string;
  locations: Array<{
    id: string;
    name: string;
    address: string;
  }>;
  availability?: {
    monday: TimeSlot[];
    tuesday: TimeSlot[];
    wednesday: TimeSlot[];
    thursday: TimeSlot[];
    friday: TimeSlot[];
    saturday: TimeSlot[];
    sunday: TimeSlot[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  startTime: string; // 24-hour format, e.g., "09:00"
  endTime: string; // 24-hour format, e.g., "17:00"
}