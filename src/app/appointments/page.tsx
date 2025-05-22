'use client';

import { useState } from 'react';
import { AppointmentScheduler } from '@/ui/components/scheduling';
import { useAppointments, useProviders } from '@/ui/hooks';
import { useAIAssistant } from '@/ui/providers/ai-assistant/AIAssistantProvider';
import { AppointmentTourModal, TourStep } from '@/ui/components/tours/AppointmentTourModal';
import { AudioManager } from '@/core/ai/AudioManager';
import { appointmentBookingWorkflow } from '@/core/ai/workflows/tours/appointmentBookingWorkflow';

interface Location {
  id: string;
  name: string;
  address: string;
  distance?: number;
}

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  specialties: string[];
  profileImage?: string;
  bio?: string;
  education?: string[];
  languages?: string[];
  yearsOfExperience?: number;
  acceptingNewPatients?: boolean;
  locations: Location[];
  rating?: number;
  nextAvailable?: string;
  availabilityStatus?: 'available-today' | 'available-week' | 'limited' | 'unavailable';
}

interface Specialty {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

// Mock specialties data
const mockSpecialties: Specialty[] = [
  {
    id: 'family-medicine',
    name: 'Family Medicine',
    description: 'Primary care for patients of all ages',
    icon: '👪',
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    description: 'Children\'s healthcare specialists',
    icon: '👶',
  },
  {
    id: 'womens-health',
    name: 'Women\'s Health',
    description: 'Comprehensive women\'s healthcare services',
    icon: '👩',
  },
  {
    id: 'chiropractic',
    name: 'Chiropractic',
    description: 'Non-surgical treatments for neck, back and joint pain',
    icon: '🦴',
  },
  {
    id: 'podiatry',
    name: 'Podiatry',
    description: 'Specialized care for feet and ankle conditions',
    icon: '🦶',
  },
  {
    id: 'dental',
    name: 'Dental',
    description: 'Complete oral healthcare for adults and children',
    icon: '🦷',
  }
];

// Mock providers data
const mockProviders: Provider[] = [
  {
    id: 'dr-smith',
    firstName: 'Sara',
    lastName: 'Smith', 
    title: 'MD, Family Medicine',
    specialties: ['family-medicine'],
    profileImage: '/images/sara_doctor.png',
    rating: 4.8,
    availabilityStatus: 'available-today',
    nextAvailable: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    bio: 'Dr. Sara Smith has been practicing family medicine for over 15 years. She believes in building long-term relationships with her patients and providing comprehensive, personalized care for the entire family.',
    education: [
      'MD from Johns Hopkins University School of Medicine',
      'Residency in Family Medicine at Mayo Clinic',
      'Board Certified in Family Medicine'
    ],
    languages: ['English', 'Spanish'],
    yearsOfExperience: 15,
    acceptingNewPatients: true,
    locations: [
      {
        id: 'main-clinic',
        name: 'Main Street Clinic',
        address: '123 Main St, Anytown, USA',
        distance: 2.3
      }
    ]
  },
  {
    id: 'dr-patel',
    firstName: 'Raj',
    lastName: 'Patel',
    title: 'MD, Pediatrician',
    specialties: ['pediatrics'],
    profileImage: '/images/dr-patel.png',
    rating: 4.7,
    availabilityStatus: 'available-week',
    nextAvailable: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    bio: 'Dr. Patel specializes in pediatric care and has a particular interest in childhood development and preventive care. He strives to make every child\'s visit comfortable and enjoyable.',
    education: [
      'MD from Stanford University School of Medicine',
      'Pediatric Residency at Children\'s Hospital of Philadelphia',
      'Board Certified in Pediatrics'
    ],
    languages: ['English', 'Hindi', 'Gujarati'],
    yearsOfExperience: 12,
    acceptingNewPatients: true,
    locations: [
      {
        id: 'kids-clinic',
        name: 'Children\'s Wellness Center',
        address: '456 Park Ave, Anytown, USA',
        distance: 3.1
      }
    ]
  },
  {
    id: 'dr-chen',
    firstName: 'Lisa',
    lastName: 'Chen',
    title: 'MD, Women\'s Health Specialist',
    specialties: ['womens-health'],
    profileImage: '/images/dr-chen.png',
    rating: 4.6,
    availabilityStatus: 'limited',
    nextAvailable: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    bio: 'Dr. Lisa Chen is dedicated to providing comprehensive women\'s healthcare services. She has special interests in preventive care, reproductive health, and menopause management.',
    education: [
      'MD from Yale School of Medicine',
      'Residency in Obstetrics and Gynecology at UCLA',
      'Board Certified in Obstetrics and Gynecology'
    ],
    languages: ['English', 'Mandarin'],
    yearsOfExperience: 18,
    acceptingNewPatients: true,
    locations: [
      {
        id: 'womens-clinic',
        name: 'Women\'s Wellness Center',
        address: '789 Oak Rd, Anytown, USA',
        distance: 2.7
      }
    ]
  },
  {
    id: 'dr-thompson-womens',
    firstName: 'Emily',
    lastName: 'Thompson',
    title: 'MD, Women\'s Health',
    specialties: ['womens-health'],
    profileImage: '/images/emily_doctor.png',
    rating: 4.7,
    availabilityStatus: 'available-week',
    nextAvailable: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    bio: 'Dr. Emily Thompson specializes in women\'s health with a focus on preventive care and family planning. She provides compassionate care in a comfortable environment.',
    education: [
      'MD from University of California, San Francisco',
      'Residency in Obstetrics and Gynecology at UCSF',
      'Board Certified in Obstetrics and Gynecology'
    ],
    languages: ['English', 'French'],
    yearsOfExperience: 9,
    acceptingNewPatients: true,
    locations: [
      {
        id: 'womens-clinic-west',
        name: 'Westside Women\'s Health',
        address: '345 Sunset Blvd, Anytown, USA',
        distance: 3.4
      }
    ]
  },
  {
    id: 'dr-johnson',
    firstName: 'Michael',
    lastName: 'Johnson',
    title: 'DC, Chiropractor',
    specialties: ['chiropractic'],
    profileImage: '/images/dr-johnson.png',
    rating: 4.5,
    availabilityStatus: 'available-today',
    nextAvailable: new Date().toISOString(),
    bio: 'Dr. Johnson focuses on providing natural, non-invasive treatments for pain relief and improved mobility. He has extensive experience in sports injuries and rehabilitation.',
    education: [
      'Doctor of Chiropractic from Palmer College of Chiropractic',
      'Certified in Active Release Technique',
      'Sports Chiropractic Certification'
    ],
    languages: ['English'],
    yearsOfExperience: 10,
    acceptingNewPatients: true,
    locations: [
      {
        id: 'spine-clinic',
        name: 'Spine & Sports Wellness Center',
        address: '321 Elm St, Anytown, USA',
        distance: 4.2
      }
    ]
  },
  {
    id: 'dr-rodriguez',
    firstName: 'Mike',
    lastName: 'Rodriguez',
    title: 'DPM, Podiatrist',
    specialties: ['podiatry'],
    profileImage: '/images/dr-rodriguez.png',
    bio: 'Dr. Mike Rodriguez specializes in comprehensive foot and ankle care. He has extensive training in both surgical and non-surgical treatments for all types of foot conditions.',
    education: [
      'Doctor of Podiatric Medicine from Temple University',
      'Surgical Residency at Mount Sinai Hospital',
      'Board Certified in Foot Surgery'
    ],
    languages: ['English', 'Spanish'],
    yearsOfExperience: 8,
    acceptingNewPatients: true,
    rating: 4.6,
    availabilityStatus: 'available-today',
    nextAvailable: new Date().toISOString(),
    locations: [
      {
        id: 'foot-clinic',
        name: 'Advanced Foot Care Center',
        address: '567 Pine St, Anytown, USA',
        distance: 1.5
      }
    ]
  },
  {
    id: 'dr-kim',
    firstName: 'Kim',
    lastName: 'Won',
    title: 'MD, Pediatrician',
    specialties: ['pediatrics'],
    profileImage: '/images/dr-kim.png',
    rating: 4.9,
    availabilityStatus: 'available-today',
    nextAvailable: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    bio: 'Dr. Kim Won is a board-certified pediatrician with expertise in developmental pediatrics and childhood wellness. She has a gentle approach that helps children feel comfortable during their visits.',
    education: [
      'MD from Harvard Medical School',
      'Pediatric Residency at Boston Children\'s Hospital',
      'Board Certified in Pediatrics'
    ],
    languages: ['English', 'Korean', 'Mandarin'],
    yearsOfExperience: 11,
    acceptingNewPatients: true,
    locations: [
      {
        id: 'kids-clinic-east',
        name: 'Eastside Pediatric Center',
        address: '678 Willow Dr, Anytown, USA',
        distance: 2.1
      }
    ]
  },
  {
    id: 'dr-white',
    firstName: 'James',
    lastName: 'White',
    title: 'DDS, General Dentist',
    specialties: ['dental'],
    profileImage: '/images/dr-white.png',
    bio: 'Dr. James White provides comprehensive dental care with a focus on preventive dentistry and cosmetic procedures. He stays current with the latest dental technologies and techniques.',
    education: [
      'Doctor of Dental Surgery from University of Michigan',
      'Advanced Training in Cosmetic Dentistry',
      'Certified in Invisalign Treatment'
    ],
    languages: ['English'],
    yearsOfExperience: 14,
    acceptingNewPatients: true,
    rating: 4.4,
    availabilityStatus: 'limited',
    nextAvailable: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    locations: [
      {
        id: 'dental-clinic',
        name: 'Bright Smile Dental',
        address: '890 Maple Ave, Anytown, USA',
        distance: 3.2
      }
    ]
  },
];

export default function AppointmentsPage() {
  // Mock patient ID - in a real app, this would come from authentication
  const [patientId] = useState('patient-123');
  
  // Use our hooks for providers and appointments
  const { providers } = useProviders();
  const { getAvailableSlots, scheduleAppointment } = useAppointments();
  
  // AI Assistant and tour state management
  const { initialize, startWorkflow, state, currentStep, selectChoice, hideAssistant } = useAIAssistant();
  const [audioManager] = useState(() => new AudioManager());
  
  // Get the modal steps from the appointment booking workflow
  const modalSteps = appointmentBookingWorkflow.modalSteps;
  
  const handleStartTour = () => {
    console.log('Tour button clicked');
    console.log('Current state before initialize:', state);
    initialize();
    console.log('Starting appointment_booking_tour workflow');
    startWorkflow('appointment_booking_tour');
    console.log('Current state after startWorkflow:', state);
  };
  
  const handleModalClose = () => {
    if (audioManager) {
      audioManager.stopAudio();
    }
    hideAssistant();
  };
  
  const handleStepComplete = () => {
    // Progress to the next step in the workflow
    if (currentStep && currentStep.choices && currentStep.choices.length > 0) {
      // If the current step has choices, select the first one to progress
      selectChoice(currentStep.choices[0].id);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">
              Schedule an Appointment
            </h1>
            <p className="text-neutral-600 mt-2">
              Search for available appointments with our healthcare providers.
            </p>
          </div>
          <div className="flex-shrink-0 relative group">
            <button
              onClick={handleStartTour}
              className="bg-primary-600 hover:bg-primary-700 text-white rounded-md px-4 py-2 flex items-center justify-center gap-2 relative hover:scale-105 transition-all duration-300"
              aria-label="Take Guided Tour"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-medium text-sm">Tour</span>
            </button>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Take Guided Tour
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
            
            {/* Subtle attention indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse pointer-events-none"></div>
          </div>
        </div>
      </div>
      
      <div className="scheduler-container">
        <AppointmentScheduler
          specialties={mockSpecialties}
          providers={mockProviders}
          patientId={patientId}
          getAvailableSlots={getAvailableSlots}
          scheduleAppointment={scheduleAppointment}
        />
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 bg-black text-white p-2 text-xs z-50">
          State: {state.uiState} | Workflow: {state.currentWorkflowId} | Step: {state.currentStepId}
        </div>
      )}

      {/* Use the standard AI Assistant workflow instead of the custom modal */}
      {/* The AI Assistant will handle the appointment booking tour automatically */}
    </div>
  );
}