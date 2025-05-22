/**
 * Appointment Tour Configuration
 * 
 * This file centralizes all appointment tour steps, making it easy to:
 * - Update text content
 * - Change audio files
 * - Reorder steps
 * - Add/remove steps
 * - Modify the flow without touching code
 */

export interface TourStepConfig {
  id: string;
  title: string;
  text: string;
  audioFile: string;
  triggerCondition?: {
    schedulerStep?: 'SPECIALTY' | 'PROVIDER' | 'DATETIME' | 'DETAILS' | 'CONFIRMATION';
    action?: 'specialty_select' | 'provider_select' | 'slot_select' | 'next_click';
  };
  nextStepId?: string;
}

export interface AppointmentTourConfig {
  id: string;
  name: string;
  description: string;
  steps: TourStepConfig[];
}

/**
 * EDIT THIS CONFIGURATION TO UPDATE THE TOUR
 * 
 * Instructions:
 * 1. To change text: Update the 'text' field
 * 2. To change audio: Update the 'audioFile' field
 * 3. To reorder steps: Drag/move items in the steps array
 * 4. To add steps: Add new objects to the steps array
 * 5. To remove steps: Delete objects from the steps array
 * 6. To change flow: Update 'nextStepId' fields
 */
export const appointmentTourConfig: AppointmentTourConfig = {
  id: "appointment_booking_tour",
  name: "Appointment Booking Tour",
  description: "A step-by-step guide through booking your first appointment",
  
  steps: [
    {
      id: "specialty_selection",
      title: "Choose Your Specialty",
      text: "Welcome! Let's book your appointment.\n\nFirst, select a specialty that matches your needs and click Next.",
      audioFile: "appointment-booking/specialty.mp3",
      triggerCondition: {
        schedulerStep: 'SPECIALTY',
        action: 'specialty_select'
      },
      nextStepId: "provider_selection"
    },
    {
      id: "provider_selection",
      title: "Choose Your Doctor",
      text: "Great! Now select the doctor you would like and click Next.",
      audioFile: "appointment-booking/doctor.mp3",
      triggerCondition: {
        schedulerStep: 'PROVIDER',
        action: 'provider_select'
      },
      nextStepId: "date_time_selection"
    },
    {
      id: "date_time_selection",
      title: "Pick Date & Time",
      text: "Perfect! Now select the date and time that works best for you and click Next.",
      audioFile: "appointment-booking/datetime.mp3",
      triggerCondition: {
        schedulerStep: 'DATETIME',
        action: 'slot_select'
      },
      nextStepId: "visit_reason"
    },
    {
      id: "visit_reason",
      title: "Visit Reason",
      text: "Almost done! Please write a brief reason for your visit and click Next.",
      audioFile: "appointment-booking/reason.mp3",
      triggerCondition: {
        schedulerStep: 'DETAILS',
        action: 'next_click'
      },
      nextStepId: "appointment_confirmed"
    },
    {
      id: "appointment_confirmed",
      title: "All Set!",
      text: "Congratulations! Your appointment is booked. It was that simple!\n\nCheck your email for a copy or print a copy for your records.\n\nSee you soon. Thank you and take care!",
      audioFile: "appointment-booking/complete.mp3"
      // No nextStepId means this is the final step
    }
  ]
};

/**
 * QUICK EDIT HELPERS
 * 
 * Common modifications you might want to make:
 */

// To add a new step, copy this template:
/*
{
  id: "new_step_id",
  title: "Step Title",
  text: "Step description text that will appear in the popup.",
  audioFile: "appointment-booking/new_audio_file.mp3",
  triggerCondition: {
    schedulerStep: 'PROVIDER', // When this triggers
    action: 'provider_select'   // What action triggers it
  },
  nextStepId: "next_step_id"
}
*/

// To remove a step: Delete the entire step object from the steps array

// To reorder steps: Cut and paste step objects in the desired order

// To change when a step triggers: Update the triggerCondition object

// Available scheduler steps: 'SPECIALTY', 'PROVIDER', 'DATETIME', 'DETAILS', 'CONFIRMATION'
// Available actions: 'specialty_select', 'provider_select', 'slot_select', 'next_click'