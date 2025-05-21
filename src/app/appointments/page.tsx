'use client';

import { useState } from 'react';
import { AppointmentScheduler } from '@/ui/components/scheduling';
import { useAppointments, useProviders } from '@/ui/hooks';

interface Location {
  id: string;
  name: string;
  address: string;
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
    firstName: 'Sarah',
    lastName: 'Smith',
    title: 'MD, Family Medicine',
    specialties: ['family-medicine'],
    profileImage: '/images/providers/dr-smith.jpg',
    bio: 'Dr. Smith has been practicing family medicine for over 15 years. She believes in building long-term relationships with her patients and providing comprehensive, personalized care for the entire family.',
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
        address: '123 Main St, Anytown, USA'
      }
    ]
  },
  {
    id: 'dr-patel',
    firstName: 'Raj',
    lastName: 'Patel',
    title: 'MD, Pediatrician',
    specialties: ['pediatrics'],
    profileImage: '/images/providers/dr-patel.jpg',
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
        address: '456 Park Ave, Anytown, USA'
      }
    ]
  },
  {
    id: 'dr-chen',
    firstName: 'Lisa',
    lastName: 'Chen',
    title: 'MD, Women\'s Health Specialist',
    specialties: ['womens-health'],
    profileImage: '/images/providers/dr-chen.jpg',
    bio: 'Dr. Chen is dedicated to providing comprehensive women\'s healthcare services. She has special interests in preventive care, reproductive health, and menopause management.',
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
        address: '789 Oak Rd, Anytown, USA'
      }
    ]
  },
  {
    id: 'dr-johnson',
    firstName: 'Michael',
    lastName: 'Johnson',
    title: 'DC, Chiropractor',
    specialties: ['chiropractic'],
    profileImage: '/images/providers/dr-johnson.jpg',
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
        address: '321 Elm St, Anytown, USA'
      }
    ]
  },
  {
    id: 'dr-rodriguez',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    title: 'DPM, Podiatrist',
    specialties: ['podiatry'],
    profileImage: '/images/providers/dr-rodriguez.jpg',
    bio: 'Dr. Rodriguez specializes in comprehensive foot and ankle care. She has extensive training in both surgical and non-surgical treatments for all types of foot conditions.',
    education: [
      'Doctor of Podiatric Medicine from Temple University',
      'Surgical Residency at Mount Sinai Hospital',
      'Board Certified in Foot Surgery'
    ],
    languages: ['English', 'Spanish'],
    yearsOfExperience: 8,
    acceptingNewPatients: true,
    locations: [
      {
        id: 'foot-clinic',
        name: 'Advanced Foot Care Center',
        address: '567 Pine St, Anytown, USA'
      }
    ]
  },
  {
    id: 'dr-white',
    firstName: 'James',
    lastName: 'White',
    title: 'DDS, General Dentist',
    specialties: ['dental'],
    profileImage: '/images/providers/dr-white.jpg',
    bio: 'Dr. White provides comprehensive dental care with a focus on preventive dentistry and cosmetic procedures. He stays current with the latest dental technologies and techniques.',
    education: [
      'Doctor of Dental Surgery from University of Michigan',
      'Advanced Training in Cosmetic Dentistry',
      'Certified in Invisalign Treatment'
    ],
    languages: ['English'],
    yearsOfExperience: 14,
    acceptingNewPatients: true,
    locations: [
      {
        id: 'dental-clinic',
        name: 'Bright Smile Dental',
        address: '890 Maple Ave, Anytown, USA'
      }
    ]
  },
  {
    id: 'dr-thompson',
    firstName: 'Emily',
    lastName: 'Thompson',
    title: 'MD, Family Medicine',
    specialties: ['family-medicine'],
    profileImage: '/images/providers/dr-thompson.jpg',
    bio: 'Dr. Thompson emphasizes preventive care and health education in her practice. She has a special interest in managing chronic conditions and promoting healthy lifestyles.',
    education: [
      'MD from University of California, San Francisco',
      'Family Medicine Residency at Oregon Health & Science University',
      'Board Certified in Family Medicine'
    ],
    languages: ['English', 'French'],
    yearsOfExperience: 9,
    acceptingNewPatients: true,
    locations: [
      {
        id: 'family-clinic',
        name: 'Family Health Center',
        address: '234 Cedar St, Anytown, USA'
      }
    ]
  },
  {
    id: 'dr-kim',
    firstName: 'David',
    lastName: 'Kim',
    title: 'MD, Pediatrician',
    specialties: ['pediatrics'],
    profileImage: '/images/providers/dr-kim.jpg',
    bio: 'Dr. Kim is passionate about child health and development. He takes a family-centered approach to pediatric care and has expertise in behavioral health and developmental disorders.',
    education: [
      'MD from Northwestern University',
      'Pediatric Residency at Boston Children\'s Hospital',
      'Fellowship in Developmental Pediatrics'
    ],
    languages: ['English', 'Korean'],
    yearsOfExperience: 11,
    acceptingNewPatients: true,
    locations: [
      {
        id: 'peds-clinic',
        name: 'Kids First Pediatrics',
        address: '456 Birch Ln, Anytown, USA'
      }
    ]
  }
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
        providers={mockProviders}
        patientId={patientId}
        getAvailableSlots={getAvailableSlots}
        scheduleAppointment={scheduleAppointment}
      />
    </div>
  );
}