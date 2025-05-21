/**
 * TourConfigProvider
 * Loads and provides tour configurations, handling fallbacks if needed
 */
import { useMemo } from 'react';
import { useTourConfig } from '@/hooks/useTourConfig';
import { TourStep } from '@/utils/yamlLoader';

// Fallback tour steps in case the YAML config fails to load
const fallbackTourSteps: TourStep[] = [
  {
    id: 'navbar',
    selector: "nav#navbar",
    title: "Navigation",
    description: "Use the navigation bar to move between different sections of the application. You can access appointments, patient intake, your profile, and more.",
    position: "bottom" as const,
    audioFile: "welcome/navigation-intro.mp3"
  },
  {
    id: 'appointments',
    selector: "a[href='/appointments']",
    title: "Appointment Scheduling",
    description: "Let's start with appointments. Our platform makes it easy to schedule, reschedule, or cancel appointments.",
    position: "bottom" as const,
    audioFile: "appointment/appointment_scheduling.mp3"
  },
  {
    id: 'patient_intake',
    selector: "a[href*='/intake']",
    title: "Patient Intake",
    description: "To save time at the clinic, please complete your registration and medical history online before your appointment so we can streamline our services for you.",
    position: "bottom" as const,
    audioFile: "patient-intake/patient_intake_button.mp3"
  },
  {
    id: 'my_profile',
    selector: "a[href*='/patient']",
    title: "My Profile",
    description: "View and update your personal information, contact details, and preferences in your profile section.",
    position: "bottom" as const,
    audioFile: "my-profile/my-profile-section.mp3"
  },
  {
    id: 'referrals',
    selector: "a[href='/referrals']",
    title: "Referrals",
    description: "Track and manage your referrals to specialists. Stay informed at every step of the referral process.",
    position: "bottom" as const,
    audioFile: "welcome/referrals-intro.mp3"
  },
  {
    id: 'billing',
    selector: "#billing-menu button",
    title: "Billing & Insurance",
    description: "Manage your insurance information, view statements, and make payments securely through our platform.",
    position: "top" as const,
    audioFile: "welcome/billing-intro.mp3"
  },
  {
    id: 'help',
    selector: "a.need-help-button",
    title: "Need Help?",
    description: "Click this button anytime you need assistance with the platform. Our AI assistant will guide you through any process.",
    position: "left" as const,
    audioFile: "welcome/help-intro.mp3"
  }
];

export interface TourConfigResult {
  tourSteps: TourStep[];
  loading: boolean;
  error: string | null;
}

export const useTourConfigProvider = (tourId: string = 'quick_tour'): TourConfigResult => {
  // Load tour configuration from YAML
  const { 
    tourSteps: configuredTourSteps, 
    loading, 
    error 
  } = useTourConfig(tourId);
  
  // Use configured tour steps if available, otherwise fall back to the default steps
  const tourSteps = useMemo(() => {
    // Log tour configuration details for debugging
    if (error) {
      console.error("Error loading tour configuration:", error);
      console.log("Using fallback tour steps");
    } else if (!loading) {
      console.log("Loaded tour steps from YAML:", configuredTourSteps);
    }
    
    return configuredTourSteps.length > 0 ? configuredTourSteps : fallbackTourSteps;
  }, [configuredTourSteps, loading, error]);

  return {
    tourSteps,
    loading,
    error
  };
};