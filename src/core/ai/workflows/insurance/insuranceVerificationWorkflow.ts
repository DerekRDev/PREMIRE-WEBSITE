import { Workflow } from '../../WorkflowTypes';

/**
 * Insurance Verification Workflow
 * Help with verifying insurance coverage
 */
export const insuranceVerificationWorkflow: Workflow = {
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
};