import { Workflow } from '../../WorkflowTypes';

/**
 * Appointment Booking Workflow
 * Guide through the appointment booking process
 */
export const scheduleWorkflow: Workflow = {
  id: "appointment_booking",
  name: "Book an Appointment",
  description: "Guide through the appointment booking process",
  initialStep: "welcome",
  steps: [
    {
      id: "welcome",
      displayType: "popup",
      text: "I'll help you book your appointment. What type of appointment do you need?",
      audioFile: "appointment/welcome.mp3",
      choices: [
        {
          id: "new_patient",
          text: "New Patient Visit",
          iconUrl:
            'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>',
          nextStepId: "select_specialty",
          storeData: {
            appointmentType: "new_patient",
          },
        },
        {
          id: "follow_up",
          text: "Follow-up Visit",
          iconUrl:
            'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>',
          nextStepId: "select_provider",
          storeData: {
            appointmentType: "follow_up",
          },
        },
      ],
      actions: {
        beforeStep: ["navigate:/appointments/new"],
      },
    },
    {
      id: "select_specialty",
      displayType: "popup",
      text: "What specialty do you need to see?",
      audioFile: "appointment/select_specialty.mp3",
      choices: [
        {
          id: "primary_care",
          text: "Primary Care",
          iconUrl:
            'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>',
          nextStepId: "select_date",
          storeData: {
            specialty: "primary_care",
          },
        },
        {
          id: "cardiology",
          text: "Cardiology",
          iconUrl:
            'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
          nextStepId: "select_date",
          storeData: {
            specialty: "cardiology",
          },
        },
      ],
    },
    {
      id: "select_provider",
      displayType: "popup",
      text: "Which provider would you like to see?",
      audioFile: "appointment/select_provider.mp3",
      choices: [
        {
          id: "dr_smith",
          text: "Dr. Smith",
          iconUrl:
            'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
          nextStepId: "select_date",
          storeData: {
            provider: "dr_smith",
          },
        },
        {
          id: "dr_jones",
          text: "Dr. Jones",
          iconUrl:
            'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
          nextStepId: "select_date",
          storeData: {
            provider: "dr_jones",
          },
        },
      ],
    },
    {
      id: "select_date",
      displayType: "calendar",
      text: "Please select a date and time for your appointment.",
      audioFile: "appointment/select_date.mp3",
      choices: [
        {
          id: "confirm_date",
          text: "Confirm",
          iconUrl:
            'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
          nextStepId: "confirmation",
        },
      ],
    },
    {
      id: "confirmation",
      displayType: "celebration",
      text: "Great! Your appointment has been scheduled. You'll receive a confirmation email shortly.",
      audioFile: "appointment/confirmation.mp3",
      choices: [
        {
          id: "done",
          text: "Done",
          iconUrl:
            'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
          nextStepId: null,
        },
      ],
      actions: {
        beforeStep: ["navigate:/appointments/confirmation"],
      },
    },
  ],
};