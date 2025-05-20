import { useState } from 'react';

export interface Choice {
  id: string;
  text: string;
  action?: string;
}

export interface Step {
  id: string;
  text: string;
  displayType: 'popup' | 'celebration' | 'calendar' | 'form';
  choices?: Choice[];
}

interface AIState {
  uiState: 'hidden' | 'visible';
  currentStepId: string | null;
  voiceConfig?: {
    voiceId: string;
    enabled: boolean;
  };
}

const initialStep: Step = {
  id: 'welcome',
  text: 'Welcome! How can I assist you today?',
  displayType: 'popup',
  choices: [
    {
      id: 'start_tour',
      text: 'Take a quick tour',
      action: 'START_TOUR'
    },
    {
      id: 'schedule_appointment',
      text: 'Schedule an appointment',
      action: 'OPEN_SCHEDULER'
    },
    {
      id: 'get_help',
      text: 'Get help',
      action: 'SHOW_HELP'
    }
  ]
};

export const useAIAssistant = () => {
  const [state, setState] = useState<AIState>({
    uiState: 'hidden', // Start hidden instead of visible
    currentStepId: null, // No active step initially
    voiceConfig: {
      voiceId: 'pNInz6obpgDQGcFmaJgB', // Rachel voice
      enabled: true
    }
  });
  const [currentStep, setCurrentStep] = useState<Step | null>(null);

  const selectChoice = (choiceId: string) => {
    console.log('Choice selected:', choiceId);
    
    // Handle different choices
    if (choiceId === 'start_tour') {
      // Start the tour
      startTour();
    } else if (choiceId === 'schedule_appointment') {
      // Handle scheduling appointment
      console.log('Would navigate to appointment scheduler');
      hideAssistant();
      // Here you might navigate to the appointment page
    } else if (choiceId === 'get_help') {
      // Handle getting help
      console.log('Would show help options');
      // Here you might show detailed help options
    } else if (choiceId === 'continue_tour') {
      // Continue to next tour step - start highlighting sections
      startTourHighlighting();
    } else if (choiceId === 'skip_tour') {
      // Skip the tour
      hideAssistant();
    }
  };
  
  // Function to start the tour
  const startTour = () => {
    console.log('Starting platform tour');
    
    // Play tour introduction audio
    try {
      const audio = new Audio('/audio/welcome/tour_intro.mp3');
      audio.play().catch(err => {
        console.error('Could not play tour intro audio:', err);
      });
    } catch (error) {
      console.error('Error setting up tour audio:', error);
    }
    
    // Set tour state - show introduction step first
    setCurrentStep({
      id: 'tour_intro',
      text: "Let me give you a quick tour of our platform features. I'll show you how to manage appointments, access medical records, communicate with providers, and handle payments.",
      displayType: 'popup',
      choices: [
        {
          id: 'continue_tour',
          text: 'Continue',
          action: 'CONTINUE_TOUR'
        },
        {
          id: 'skip_tour',
          text: 'Skip tour',
          action: 'SKIP_TOUR'
        }
      ]
    });
  };
  
  // Function to start the tour highlighting step
  const startTourHighlighting = () => {
    console.log('Starting tour highlighting');
    
    // Set tour state to first tour step (appointments) to start the highlighting
    setCurrentStep({
      id: 'tour_appointments',
      text: "Let's start with appointments. You can schedule, view, and manage your upcoming appointments in this section.",
      displayType: 'popup',
      choices: [
        {
          id: 'next_tour_step',
          text: 'Next',
          action: 'NEXT_TOUR_STEP'
        },
        {
          id: 'end_tour',
          text: 'End tour',
          action: 'END_TOUR'
        }
      ]
    });
  };

  const hideAssistant = () => {
    setState(prev => ({ ...prev, uiState: 'hidden' }));
  };

  // Function to show the welcome message
  const showWelcomeMessage = () => {
    // Set current step to welcome
    setCurrentStep(initialStep);
    // Make the assistant visible
    setState(prev => ({ 
      ...prev, 
      uiState: 'visible',
      currentStepId: 'welcome'
    }));
  };

  return {
    state,
    currentStep,
    selectChoice,
    hideAssistant,
    showWelcomeMessage,
    startTour,
    startTourHighlighting
  };
};
