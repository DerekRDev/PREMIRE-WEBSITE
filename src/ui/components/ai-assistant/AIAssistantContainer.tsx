"use client";

import React, { useState, useEffect } from 'react';
import { TourView } from './TourView';
import { useAIAssistant } from '@/ui/providers/ai-assistant/AIAssistantProvider';
import { PopupMessageUpdated } from './components/PopupMessageUpdated';
import { CelebrationView } from './components/CelebrationView';
import { ChoiceSelectorUpdated } from './components/ChoiceSelectorUpdated';

// Define tour steps
const tourSteps = [
  {
    elementId: "navbar",
    title: "Navigation",
    description: "Use the navigation bar to move between different sections of the application. You can access appointments, patient intake, your profile, and more.",
    position: "bottom" as const,
  },
  {
    selector: ".need-help-button",
    title: "Need Help?",
    description: "Click this button anytime you need assistance with the platform. Our AI assistant will guide you through any process.",
    position: "left" as const,
  },
  {
    selector: ".appointment-section",
    title: "Appointment Scheduling",
    description: "Easily schedule, view, and manage your appointments through our intuitive appointment scheduling system.",
    position: "bottom" as const,
  },
  {
    selector: ".patient-intake-section",
    title: "Patient Intake",
    description: "Complete your registration and medical history online before your appointment to save time at the clinic.",
    position: "bottom" as const,
  },
  {
    elementId: "billing-menu",
    title: "Billing & Insurance",
    description: "Manage your insurance information, view statements, and make payments securely through our platform.",
    position: "top" as const,
  }
];

/**
 * Main container for the AI Assistant UI
 */
export const AIAssistantContainer: React.FC = () => {
  const { state, currentStep, selectChoice, hideAssistant } = useAIAssistant();
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);
  
  // Debug state changes
  useEffect(() => {
    console.log('AIAssistantContainer: state changed', { 
      state, 
      currentStep,
      isTourActive,
      uiState: state.uiState
    });
  }, [state, currentStep, isTourActive]);

  // Handle tour initialization and tracking
  useEffect(() => {
    if (currentStep?.id === 'tour_intro') {
      // Initialize tour when the tour_intro step is active
      setIsTourActive(false); // Keep modal visible initially for intro
    } else if (currentStep?.id === 'tour_appointments') {
      // Start the actual tour highlighting when reaching tour_appointments step
      setIsTourActive(true);
      setTourStepIndex(0);
    } else if (currentStep?.id === 'tour_complete') {
      // End the tour when reaching completion step
      setIsTourActive(false);
    }
  }, [currentStep?.id]);

  // Handle tour step change
  const handleTourStepChange = (index: number) => {
    setTourStepIndex(index);
    
    // If this is the last step, prepare to end the tour
    if (index === tourSteps.length - 1) {
      // We'll let the user click "Finish Tour" to proceed
    }
  };

  // Handle tour completion
  const handleTourComplete = () => {
    setIsTourActive(false);
    // Move to the next step in the workflow
    if (currentStep?.choices && currentStep.choices.length > 0) {
      // Find the "continue" choice
      const continueChoice = currentStep.choices.find(choice => 
        choice.id === 'continue_tour' || choice.id === 'continue'
      );
      
      if (continueChoice) {
        selectChoice(continueChoice.id);
      }
    }
  };

  // Update the render condition to check for state
  if (!currentStep) {
    console.log('AIAssistantContainer: not rendering - no currentStep');
    return null;
  }
  
  if (state.uiState === "hidden") {
    console.log('AIAssistantContainer: not rendering - state is hidden');
    return null;
  }
  
  console.log('AIAssistantContainer: rendering content with displayType:', currentStep.displayType);

  // Render different UI based on display type
  const renderContent = () => {
    switch (currentStep.displayType) {
      case "popup":
        return (
          <PopupMessageUpdated
            text={currentStep.text}
            choices={currentStep.choices || []}
            onChoiceSelected={selectChoice}
            onClose={hideAssistant}
            useVoice={false} /* Disabled to avoid duplicate audio - workflow handles audio */
          />
        );

      case "celebration":
        return (
          <CelebrationView
            text={currentStep.text}
            choices={currentStep.choices || []}
            onChoiceSelected={selectChoice}
            onClose={hideAssistant}
          />
        );

      case "calendar":
        // Assuming you have a CalendarView component
        return (
          <div className="p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">{currentStep.text}</h2>
            <div className="mb-4">
              {/* Calendar component would go here */}
              <p className="text-gray-500">Calendar selection (placeholder)</p>
            </div>
            <ChoiceSelectorUpdated 
              choices={currentStep.choices || []} 
              onChoiceSelected={selectChoice} 
            />
          </div>
        );

      case "form":
        // Assuming you have a FormView component
        return (
          <div className="p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">{currentStep.text}</h2>
            <div className="mb-4">
              {/* Form component would go here */}
              <p className="text-gray-500">Form fields (placeholder)</p>
            </div>
            <ChoiceSelectorUpdated 
              choices={currentStep.choices || []} 
              onChoiceSelected={selectChoice} 
            />
          </div>
        );

      default:
        return (
          <div className="p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">{currentStep.text}</h2>
            <ChoiceSelectorUpdated 
              choices={currentStep.choices || []} 
              onChoiceSelected={selectChoice} 
            />
          </div>
        );
    }
  };

  // For debugging
  const dumpState = () => {
    console.log('Current state:', state);
    console.log('Current step:', currentStep);
  };

  // Voice config (fallback if not in state)
  const voiceConfig = state.voiceConfig || {
    voiceId: "pNInz6obpgDQGcFmaJgB", // Rachel voice
    enabled: true
  };

  return (
    <>
      {/* Regular assistant UI */}
      {!isTourActive && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="max-w-md w-full mx-4">
            {renderContent()}
            
            {/* Debug controls */}
            <div className="mt-4 flex space-x-2 justify-center">
              <button 
                className="bg-gray-700 text-white px-3 py-1 rounded text-xs"
                onClick={dumpState}
              >
                Debug
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tour highlighting UI */}
      {isTourActive && (
        <TourView
          steps={tourSteps}
          currentStepIndex={tourStepIndex}
          onStepChange={handleTourStepChange}
          onClose={() => {
            setIsTourActive(false);
            hideAssistant();
          }}
          onComplete={handleTourComplete}
        />
      )}
    </>
  );
};