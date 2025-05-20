import type { Workflow } from '../WorkflowTypes';

/**
 * Sample workflow definitions for the AI Patient Assistant
 */
export const sampleWorkflows: Workflow[] = [
  // Welcome/Introduction Flow
  {
    id: "welcome",
    name: "Welcome Introduction",
    description: "Orient new patients to the platform",
    initialStep: "welcome",
    steps: [
      {
        id: "welcome",
        displayType: "popup",
        text: "Welcome to Premier Healthcare! I'm your virtual assistant and I'm here to help you navigate our platform. What would you like to do today?",
        audioFile: "welcome/intro.mp3",
        choices: [
          {
            id: "tour",
            text: "Take a quick tour",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>',
            nextStepId: "tour_intro",
          },
          {
            id: "book_appointment",
            text: "Book an appointment",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
            nextStepId: null,
            actions: ["navigate:/appointments/new"],
          },
          {
            id: "dismiss",
            text: "Maybe later",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
            nextStepId: null,
          },
        ],
      },
      {
        id: "tour_intro",
        displayType: "popup",
        text: "Great! I'll show you the key features of our platform. You can book appointments, manage your medical records, communicate with your providers, and handle payments all in one place.",
        audioFile: "welcome/tour_intro.mp3",
        choices: [
          {
            id: "continue",
            text: "Continue",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
            nextStepId: "tour_appointments",
          },
        ],
      },
      {
        id: "tour_appointments",
        displayType: "popup",
        text: "Let's start with appointments. You can easily schedule, reschedule, or cancel appointments through our platform. Would you like to see how to book an appointment now?",
        audioFile: "welcome/tour_appointments.mp3",
        choices: [
          {
            id: "yes_book",
            text: "Yes, show me how",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
            nextStepId: null,
            actions: ["navigate:/appointments/new"],
          },
          {
            id: "continue_tour",
            text: "Continue the tour",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
            nextStepId: "tour_complete",
          },
        ],
      },
      {
        id: "tour_complete",
        displayType: "celebration",
        text: "You've completed the quick tour! Remember, I'm always here to help. You can click the assistant button anytime you need guidance.",
        audioFile: "welcome/tour_complete.mp3",
        choices: [
          {
            id: "done",
            text: "Got it, thanks!",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
            nextStepId: null,
          },
        ],
      },
    ],
  },

  // Appointment Booking Flow
  {
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
  },

  // Payment Assistance Flow
  {
    id: "payment_assistance",
    name: "Payment Assistance",
    description: "Help with making payments and understanding billing",
    initialStep: "welcome",
    steps: [
      {
        id: "welcome",
        displayType: "popup",
        text: "I can help you with your payment. What would you like to do?",
        audioFile: "payment/welcome.mp3",
        choices: [
          {
            id: "make_payment",
            text: "Make a Payment",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>',
            nextStepId: "payment_method",
          },
          {
            id: "billing_question",
            text: "Billing Question",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
            nextStepId: "billing_options",
          },
        ],
        actions: {
          beforeStep: ["navigate:/payments"],
        },
      },
      {
        id: "payment_method",
        displayType: "popup",
        text: "How would you like to pay?",
        audioFile: "payment/payment_method.mp3",
        choices: [
          {
            id: "credit_card",
            text: "Credit Card",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>',
            nextStepId: "payment_confirmation",
            storeData: {
              payment_method: "credit_card",
            },
          },
          {
            id: "bank_account",
            text: "Bank Account",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 4 4 22 20 22 20 4"></polyline><polyline points="1 10 23 10"></polyline></svg>',
            nextStepId: "payment_confirmation",
            storeData: {
              payment_method: "bank_account",
            },
          },
        ],
      },
      {
        id: "billing_options",
        displayType: "popup",
        text: "What do you need help with?",
        audioFile: "payment/billing_options.mp3",
        choices: [
          {
            id: "understand_bill",
            text: "Understand My Bill",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
            nextStepId: "bill_explanation",
          },
          {
            id: "payment_plan",
            text: "Set Up Payment Plan",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
            nextStepId: "payment_plan_options",
          },
        ],
      },
      {
        id: "payment_confirmation",
        displayType: "celebration",
        text: "Thank you! Your payment has been processed successfully.",
        audioFile: "payment/confirmation.mp3",
        choices: [
          {
            id: "done",
            text: "Done",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
            nextStepId: null,
          },
        ],
      },
      {
        id: "bill_explanation",
        displayType: "popup",
        text: "Your bill includes charges for your recent visit, lab work, and any medications. Would you like me to explain each section?",
        audioFile: "payment/bill_explanation.mp3",
        choices: [
          {
            id: "yes_explain",
            text: "Yes, Please Explain",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>',
            nextStepId: "detailed_explanation",
          },
          {
            id: "no_thanks",
            text: "No Thanks",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
            nextStepId: null,
          },
        ],
      },
      {
        id: "payment_plan_options",
        displayType: "form",
        text: "We offer several payment plan options. Please let us know what works best for you.",
        audioFile: "payment/payment_plan_options.mp3",
        choices: [
          {
            id: "three_months",
            text: "3 Months",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>',
            nextStepId: "payment_plan_confirmation",
            storeData: {
              payment_plan: "3_months",
            },
          },
          {
            id: "six_months",
            text: "6 Months",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 18 11 18 7 6"></polyline><line x1="11" y1="13" x2="17" y2="13"></line></svg>',
            nextStepId: "payment_plan_confirmation",
            storeData: {
              payment_plan: "6_months",
            },
          },
          {
            id: "twelve_months",
            text: "12 Months",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 18 12 22 16 18"></polyline><polyline points="8 6 12 2 16 6"></polyline><line x1="12" y1="2" x2="12" y2="22"></line></svg>',
            nextStepId: "payment_plan_confirmation",
            storeData: {
              payment_plan: "12_months",
            },
          },
        ],
      },
      {
        id: "payment_plan_confirmation",
        displayType: "celebration",
        text: "Thank you! Your payment plan has been set up. You'll receive a confirmation email with details shortly.",
        audioFile: "payment/payment_plan_confirmation.mp3",
        choices: [
          {
            id: "done",
            text: "Done",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
            nextStepId: null,
          },
        ],
      },
      {
        id: "detailed_explanation",
        displayType: "popup",
        text: "Your bill consists of several parts: 1) Professional fees for your provider's services, 2) Facility fees for the use of our clinic, 3) Laboratory fees for any tests performed, and 4) Medication charges if any prescriptions were filled. The amount you owe depends on your insurance coverage and deductible status.",
        audioFile: "payment/detailed_explanation.mp3",
        choices: [
          {
            id: "understand",
            text: "I Understand",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>',
            nextStepId: null,
          },
          {
            id: "more_help",
            text: "I Need More Help",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
            nextStepId: null,
            actions: ["navigate:/financial-assistance"],
          },
        ],
      },
    ],
  },

  // Insurance Verification Flow
  {
    id: "insurance_verification",
    name: "Insurance Verification",
    description: "Help with verifying insurance coverage",
    initialStep: "welcome",
    steps: [
      {
        id: "welcome",
        displayType: "popup",
        text: "I can help you verify your insurance coverage. What would you like to do?",
        audioFile: "insurance/welcome.mp3",
        choices: [
          {
            id: "verify_coverage",
            text: "Verify My Coverage",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
            nextStepId: "scan_card",
          },
          {
            id: "add_insurance",
            text: "Add New Insurance",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
            nextStepId: "add_insurance_form",
          },
        ],
        actions: {
          beforeStep: ["navigate:/insurance/verify"],
        },
      },
      {
        id: "scan_card",
        displayType: "popup",
        text: "Please scan the front and back of your insurance card. You can use your camera to take a photo.",
        audioFile: "insurance/scan_card.mp3",
        choices: [
          {
            id: "scan_now",
            text: "Scan My Card",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>',
            nextStepId: "verifying",
          },
          {
            id: "enter_manually",
            text: "Enter Details Manually",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
            nextStepId: "manual_entry",
          },
        ],
      },
      {
        id: "verifying",
        displayType: "popup",
        text: "Verifying your insurance information...",
        audioFile: "insurance/verifying.mp3",
        choices: [
          {
            id: "continue",
            text: "Continue",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
            nextStepId: "verification_result",
          },
        ],
      },
      {
        id: "verification_result",
        displayType: "celebration",
        text: "Good news! Your insurance is active and covers services at our facility. Your estimated co-pay for a primary care visit is $25.",
        audioFile: "insurance/verification_result.mp3",
        choices: [
          {
            id: "done",
            text: "Done",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
            nextStepId: null,
          },
          {
            id: "book_appointment",
            text: "Book an Appointment",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
            nextStepId: null,
            actions: ["navigate:/appointments/new"],
          },
        ],
      },
      {
        id: "manual_entry",
        displayType: "form",
        text: "Please enter your insurance information manually:",
        audioFile: "insurance/manual_entry.mp3",
        choices: [
          {
            id: "submit_manual",
            text: "Submit",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
            nextStepId: "verifying",
          },
        ],
      },
      {
        id: "add_insurance_form",
        displayType: "form",
        text: "Please enter your new insurance information:",
        audioFile: "insurance/add_insurance_form.mp3",
        choices: [
          {
            id: "submit_insurance",
            text: "Submit",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
            nextStepId: "insurance_added",
          },
        ],
      },
      {
        id: "insurance_added",
        displayType: "celebration",
        text: "Your new insurance information has been added successfully! Would you like to verify your coverage?",
        audioFile: "insurance/insurance_added.mp3",
        choices: [
          {
            id: "verify_now",
            text: "Verify Coverage",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
            nextStepId: "verifying",
          },
          {
            id: "later",
            text: "Maybe Later",
            iconUrl:
              'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
            nextStepId: null,
          },
        ],
      },
    ],
  },
];