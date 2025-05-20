'use client';

import { useState } from 'react';
import { AppointmentScheduler } from '@/ui/components/scheduling';
import { useAppointments, useProviders } from '@/ui/hooks';

interface Specialty {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

// Mock specialties data
const mockSpecialties: Specialty[] = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    description: 'Heart and cardiovascular system specialists',
    icon: '❤️',
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    description: 'Skin, hair, and nail specialists',
    icon: '🧴',
  },
  {
    id: 'family-medicine',
    name: 'Family Medicine',
    description: 'Primary care for patients of all ages',
    icon: '👪',
  },
  {
    id: 'gastroenterology',
    name: 'Gastroenterology',
    description: 'Digestive system specialists',
    icon: '🍃',
  },
  {
    id: 'internal-medicine',
    name: 'Internal Medicine',
    description: 'Prevention, diagnosis, and treatment of adult diseases',
    icon: '💊',
  },
  {
    id: 'neurology',
    name: 'Neurology',
    description: 'Nervous system specialists',
    icon: '🧠',
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    description: 'Children\'s healthcare specialists',
    icon: '👶',
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    description: 'Bone and muscle specialists',
    icon: '🦴',
  },
];

export default function AppointmentsPage() {
  // Mock patient ID - in a real app, this would come from authentication
  const [patientId] = useState('patient-123');
  
  // Use our hooks for providers and appointments
  const { providers } = useProviders();
  const { getAvailableSlots, scheduleAppointment } = useAppointments();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">
          Schedule an Appointment
        </h1>
        <p className="text-neutral-600 mt-2">
          Search for available appointments with our healthcare providers.
        </p>
      </div>
      
      <AppointmentScheduler
        specialties={mockSpecialties}
        providers={providers}
        patientId={patientId}
        getAvailableSlots={getAvailableSlots}
        scheduleAppointment={scheduleAppointment}
      />
    </div>
  );
}