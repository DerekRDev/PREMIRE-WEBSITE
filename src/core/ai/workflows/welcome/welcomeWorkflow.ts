import { Workflow } from '../../WorkflowTypes';

/**
 * Welcome Introduction Workflow
 * Orient new patients to the platform
 */
export const welcomeWorkflow: Workflow = {
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
          nextStepId: null,
          // Launch the quick_tour workflow instead of continuing within this workflow
          actions: ["startWorkflow:quick_tour"],
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
    }
  ],
};