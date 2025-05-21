import { Workflow } from '../../WorkflowTypes';

/**
 * Payment Assistance Workflow
 * Help with making payments and understanding billing
 */
export const paymentWorkflow: Workflow = {
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
};