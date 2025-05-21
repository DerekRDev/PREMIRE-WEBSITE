import { Workflow } from '../../WorkflowTypes';

/**
 * Quick Tour Workflow
 * A guided tour of the platform's features for new users
 */
export const quickTourWorkflow: Workflow = {
  id: "quick_tour",
  name: "Quick Tour",
  description: "A guided tour of the platform's key features",
  initialStep: "tour_intro",
  steps: [
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
          nextStepId: "navigation_overview",
        }
      ]
    },
    {
      id: "navigation_overview",
      displayType: "popup",
      text: "Let's start with the navigation menu. This menu helps you access different sections of our platform.",
      audioFile: "welcome/navigation-intro.mp3",
      choices: [
        {
          id: "next",
          text: "Next",
          iconUrl:
            'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
          nextStepId: "appointments_overview",
        }
      ]
    },
    {
      id: "appointments_overview",
      displayType: "popup",
      text: "The Appointments section lets you schedule, view, and manage your appointments with providers.",
      audioFile: "appointment/appointment_scheduling.mp3",
      choices: [
        {
          id: "show_appointments",
          text: "Show me how to book",
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
          nextStepId: "intake_overview",
        }
      ]
    },
    {
      id: "intake_overview",
      displayType: "popup",
      text: "The Patient Intake section allows you to complete registration forms and provide medical history before your visit, saving time at the clinic.",
      audioFile: "patient-intake/patient_intake_button.mp3",
      choices: [
        {
          id: "next",
          text: "Next",
          iconUrl:
            'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
          nextStepId: "profile_overview",
        }
      ]
    },
    {
      id: "profile_overview",
      displayType: "popup",
      text: "The My Profile section lets you update your personal information, view your medical history, and manage your account settings.",
      audioFile: "my-profile/my-profile-section.mp3",
      choices: [
        {
          id: "next",
          text: "Next",
          iconUrl:
            'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
          nextStepId: "referrals_overview",
        }
      ]
    },
    {
      id: "referrals_overview",
      displayType: "popup",
      text: "The Referrals section helps you track and manage referrals to specialists. You can see the status of your referrals and necessary next steps.",
      audioFile: "referrals/referrals_button.mp3",
      choices: [
        {
          id: "next",
          text: "Next",
          iconUrl:
            'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
          nextStepId: "billing_overview",
        }
      ]
    },
    {
      id: "billing_overview",
      displayType: "popup",
      text: "The Billing & Insurance section lets you manage insurance information, make payments, and understand your billing statements.",
      audioFile: "payment/billing_and_insurance_nav.mp3",
      choices: [
        {
          id: "next",
          text: "Next",
          iconUrl:
            'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
          nextStepId: "help_overview",
        }
      ]
    },
    {
      id: "help_overview",
      displayType: "popup",
      text: "The Need Help button is available throughout the platform. Click it anytime you need assistance, and I'll guide you through any process.",
      audioFile: "need-help/need_help_button.mp3",
      choices: [
        {
          id: "next",
          text: "Next",
          iconUrl:
            'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
          nextStepId: "tour_complete",
        }
      ]
    },
    {
      id: "tour_complete",
      displayType: "celebration",
      text: "You've completed the quick tour! Remember, I'm always here to help. You can click the assistant button anytime you need guidance.",
      audioFile: "welcome/tour_complete.mp3",
      choices: [
        {
          id: "book_appointment",
          text: "Book an appointment",
          iconUrl:
            'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
          nextStepId: null,
          actions: ["navigate:/appointments/new"],
        },
        {
          id: "done",
          text: "Got it, thanks!",
          iconUrl:
            'svg:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
          nextStepId: null,
        }
      ]
    }
  ]
};