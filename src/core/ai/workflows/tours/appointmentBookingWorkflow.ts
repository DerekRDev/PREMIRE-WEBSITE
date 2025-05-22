import { Workflow, ModalStep, TourState, WorkflowStep, Choice } from '../../WorkflowTypes';

/**
 * Appointment Booking Tour Workflow
 * A step-by-step guided tour through the appointment booking process using a modal interface
 */
// Define a more specific type for this modal-based workflow
interface ModalWorkflow extends Workflow {
  modalSteps: ModalStep[];
  methods: {
    startTour: (state: TourState) => TourState;
    nextStep: (state: TourState) => TourState;
    endTour: (state: TourState) => TourState;
  };
}

export const appointmentBookingWorkflow: Workflow = {
  id: "appointment_booking_tour",
  name: "Appointment Booking Tour",
  description: "A guided tour through booking your first appointment",
  initialStep: "tour_intro",
  
  // Regular workflow steps for the AI Assistant engine
  steps: [
    {
      id: "tour_intro",
      displayType: "popup",
      text: "Welcome! Let's book your appointment in a few quick steps.\n\nStep 1: Choose a Provider\nPick the type of care you need by clicking a specialty card. Each shows what it treats—for example, Family Medicine for general health or Pediatrics for kids.\n\nThe card will highlight in blue when selected. Simply click the one that fits your need, then click Next to continue.",
      audioFile: "appointment-booking/step1_intro2.mp3",
      choices: [{ id: "next_step", text: "Continue", nextStepId: "specialty_overview" }]
    },
    {
      id: "specialty_overview",
      displayType: "popup", 
      text: "First, we need to know what type of care you're looking for. You'll see different medical specialties available. Each card shows the specialty name and what they treat.",
      audioFile: "appointment-booking/step2_specialty_overview.mp3",
      choices: [{ id: "next_step", text: "Continue", nextStepId: "specialty_selection" }]
    },
    {
      id: "specialty_selection",
      displayType: "popup",
      text: "Click on the specialty card that matches your needs. For example, choose Family Medicine for general health concerns, or Pediatrics for children's care. The card will highlight in blue when selected.",
      audioFile: "appointment-booking/step3_select_specialty.mp3", 
      choices: [{ id: "next_step", text: "Continue", nextStepId: "specialty_selected" }]
    },
    {
      id: "specialty_selected",
      displayType: "popup",
      text: "Perfect! You've selected your specialty. Notice the blue border and checkmark showing your selection. Now click the Next button to find available providers.",
      audioFile: "appointment-booking/step4_specialty_selected.mp3",
      choices: [{ id: "next_step", text: "Continue", nextStepId: "specialty_overview" }]
    },
    {
      id: "provider_search_intro", 
      displayType: "popup",
      text: "Now let's find your provider. You can search by name, filter by location, or browse all available providers for your selected specialty. Use the search box to find a specific doctor.",
      audioFile: "appointment-booking/step5_provide_search_intro.mp3",
      choices: [{ id: "next_step", text: "Continue", nextStepId: "specialty_overview" }]
    },
    {
      id: "provider_cards_overview",
      displayType: "popup",
      text: "Each provider card shows their photo, name, specialty, patient rating, and availability status. Green means available today, yellow means available this week.",
      audioFile: "appointment-booking/step6_provider_cards.mp3",
      choices: [{ id: "next_step", text: "Continue", nextStepId: "specialty_overview" }]
    },
    {
      id: "provider_selection",
      displayType: "popup", 
      text: "Click on a provider card to select them. You can click 'Read More' to see their full biography, education, and patient reviews. Once you've chosen, click Next.",
      audioFile: "appointment-booking/step7_select_provider.mp3",
      choices: [{ id: "next_step", text: "Continue", nextStepId: "specialty_overview" }]
    },
    {
      id: "date_selection",
      displayType: "popup",
      text: "Choose your preferred appointment date from the calendar. Available dates are highlighted in light blue. Dates with no availability will appear grayed out.",
      audioFile: "appointment-booking/step8_date_selection.mp3",
      choices: [{ id: "next_step", text: "Continue", nextStepId: "specialty_overview" }]
    },
    {
      id: "time_selection",
      displayType: "popup",
      text: "Select your preferred time slot. Times are organized by Morning, Afternoon, and Evening. Click on any available time slot - it will highlight in blue when selected.",
      audioFile: "appointment-booking/step9_time_selection.mp3",
      choices: [{ id: "next_step", text: "Continue", nextStepId: "specialty_overview" }]
    },
    {
      id: "appointment_details",
      displayType: "popup",
      text: "Now provide details about your visit. Choose the appointment type - Initial Visit for new concerns, Follow-up for ongoing care, or Annual Physical for checkups.",
      audioFile: "appointment-booking/step10_appointment_details.mp3",
      choices: [{ id: "next_step", text: "Continue", nextStepId: "specialty_overview" }]
    },
    {
      id: "visit_reason",
      displayType: "popup",
      text: "Describe the reason for your appointment. This helps your provider prepare and ensures you get the best care. Be specific about symptoms or concerns you'd like to discuss.",
      audioFile: "appointment-booking/step11_visit_reason.mp3",
      choices: [{ id: "next_step", text: "Continue", nextStepId: "specialty_overview" }]
    },
    {
      id: "appointment_confirmed",
      displayType: "celebration",
      text: "Excellent! Your appointment is confirmed. You'll see all the details here - date, time, provider, and location. You can print this confirmation or add it to your calendar.",
      audioFile: "appointment-booking/step12_confirmation.mp3",
      choices: [{ id: "complete", text: "Complete Tour" }]
    }
  ],
  
  // Keep modal steps for the AppointmentTourModal component
  modalSteps: [
    {
      id: "tour_intro",
      message: "Welcome! Let's book your appointment in a few quick steps.\n\nStep 1: Choose a Provider\nPick the type of care you need by clicking a specialty card. Each shows what it treats—for example, Family Medicine for general health or Pediatrics for kids.\n\nThe card will highlight in blue when selected. Simply click the one that fits your need, then click Next to continue.",
      audioFile: "appointment-booking/step1_intro2.mp3",
      isTyping: true
    },
    {
      id: "specialty_overview",
      message: "First, we need to know what type of care you're looking for. You'll see different medical specialties available. Each card shows the specialty name and what they treat.",
      audioFile: "appointment-booking/step2_specialty_overview.mp3",
      isTyping: true
    },
    {
      id: "specialty_selection",
      message: "Click on the specialty card that matches your needs. For example, choose Family Medicine for general health concerns, or Pediatrics for children's care. The card will highlight in blue when selected.",
      audioFile: "appointment-booking/step3_select_specialty.mp3",
      isTyping: true
    },
    {
      id: "specialty_selected",
      message: "Perfect! You've selected your specialty. Notice the blue border and checkmark showing your selection. Now click the Next button to find available providers.",
      audioFile: "appointment-booking/step4_specialty_selected.mp3",
      isTyping: true
    },
    {
      id: "provider_search_intro",
      message: "Now let's find your provider. You can search by name, filter by location, or browse all available providers for your selected specialty. Use the search box to find a specific doctor.",
      audioFile: "appointment-booking/step5_provide_search_intro.mp3",
      isTyping: true
    },
    {
      id: "provider_cards_overview",
      message: "Each provider card shows their photo, name, specialty, patient rating, and availability status. Green means available today, yellow means available this week.",
      audioFile: "appointment-booking/step6_provider_cards.mp3",
      isTyping: true
    },
    {
      id: "provider_selection",
      message: "Click on a provider card to select them. You can click 'Read More' to see their full biography, education, and patient reviews. Once you've chosen, click Next.",
      audioFile: "appointment-booking/step7_select_provider.mp3",
      isTyping: true
    },
    {
      id: "date_selection",
      message: "Choose your preferred appointment date from the calendar. Available dates are highlighted in light blue. Dates with no availability will appear grayed out.",
      audioFile: "appointment-booking/step8_date_selection.mp3",
      isTyping: true
    },
    {
      id: "time_selection",
      message: "Select your preferred time slot. Times are organized by Morning, Afternoon, and Evening. Click on any available time slot - it will highlight in blue when selected.",
      audioFile: "appointment-booking/step9_time_selection.mp3",
      isTyping: true
    },
    {
      id: "appointment_details",
      message: "Now provide details about your visit. Choose the appointment type - Initial Visit for new concerns, Follow-up for ongoing care, or Annual Physical for checkups.",
      audioFile: "appointment-booking/step10_appointment_details.mp3",
      isTyping: true
    },
    {
      id: "visit_reason",
      message: "Describe the reason for your appointment. This helps your provider prepare and ensures you get the best care. Be specific about symptoms or concerns you'd like to discuss.",
      audioFile: "appointment-booking/step11_visit_reason.mp3",
      isTyping: true
    },
    {
      id: "appointment_confirmed",
      message: "Excellent! Your appointment is confirmed. You'll see all the details here - date, time, provider, and location. You can print this confirmation or add it to your calendar.",
      audioFile: "appointment-booking/step12_confirmation.mp3",
      isTyping: true
    }
  ],

  // Methods to handle modal state
  methods: {
    startTour: (state: TourState) => {
      state.isModalOpen = true;
      state.currentStepIndex = 0;
      return state;
    },

    nextStep: (state: TourState) => {
      if (state.currentStepIndex < (appointmentBookingWorkflow as ModalWorkflow).modalSteps.length - 1) {
        state.currentStepIndex++;
      } else {
        state.isModalOpen = false;
        state.currentStepIndex = 0;
      }
      return state;
    },

    endTour: (state: TourState) => {
      state.isModalOpen = false;
      state.currentStepIndex = 0;
      if (state.audioManager) {
        state.audioManager.stopAudio();
      }
      return state;
    }
  }
};