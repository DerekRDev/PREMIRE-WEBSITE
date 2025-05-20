"use client";

import React, { useState, useEffect, useRef } from 'react';
import { TourView } from './TourView';
import { useAIAssistant } from '@/ui/providers/ai-assistant/AIAssistantProvider';
import { PopupMessageUpdated } from './components/PopupMessageUpdated';
import { CelebrationView } from './components/CelebrationView';
import { ChoiceSelectorUpdated } from './components/ChoiceSelectorUpdated';
import { AudioManager } from '@/core/ai/AudioManager';
import { useTourConfig } from '@/hooks/useTourConfig';
import { TourStep } from '@/utils/yamlLoader';
import dynamic from 'next/dynamic';

const ReactConfetti = dynamic(() => import('react-confetti'), { ssr: false });

// Fallback tour steps in case the YAML config fails to load
const fallbackTourSteps: TourStep[] = [
  {
    id: 'navbar',
    selector: "nav#navbar",
    title: "Navigation",
    description: "Use the navigation bar to move between different sections of the application. You can access appointments, patient intake, your profile, and more.",
    position: "bottom" as const,
    audioFile: "welcome/navigation-intro.mp3"
  },
  {
    id: 'appointments',
    selector: "a[href='/appointments']",
    title: "Appointment Scheduling",
    description: "Let's start with appointments. Our platform makes it easy to schedule, reschedule, or cancel appointments.",
    position: "bottom" as const,
    audioFile: "appointment/appointment_scheduling.mp3"
  },
  {
    id: 'patient_intake',
    selector: "a[href*='/intake']",
    title: "Patient Intake",
    description: "To save time at the clinic, please complete your registration and medical history online before your appointment so we can streamline our services for you.",
    position: "bottom" as const,
    audioFile: "patient-intake/patient_intake_button.mp3"
  },
  {
    id: 'my_profile',
    selector: "a[href*='/patient']",
    title: "My Profile",
    description: "View and update your personal information, contact details, and preferences in your profile section.",
    position: "bottom" as const,
    audioFile: "my-profile/my-profile-section.mp3"
  },
  {
    id: 'referrals',
    selector: "a[href='/referrals']",
    title: "Referrals",
    description: "Track and manage your referrals to specialists. Stay informed at every step of the referral process.",
    position: "bottom" as const,
    audioFile: "welcome/referrals-intro.mp3"
  },
  {
    id: 'billing',
    selector: "#billing-menu button",
    title: "Billing & Insurance",
    description: "Manage your insurance information, view statements, and make payments securely through our platform.",
    position: "top" as const,
    audioFile: "welcome/billing-intro.mp3"
  },
  {
    id: 'help',
    selector: "a.need-help-button",
    title: "Need Help?",
    description: "Click this button anytime you need assistance with the platform. Our AI assistant will guide you through any process.",
    position: "left" as const,
    audioFile: "welcome/help-intro.mp3"
  }
];

/**
 * Main container for the AI Assistant UI
 */
export const AIAssistantContainer: React.FC = () => {
  const { state, currentStep, selectChoice, hideAssistant } = useAIAssistant();
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);
  const [showTourComplete, setShowTourComplete] = useState(false);
  const audioManagerRef = useRef<AudioManager | null>(null);
  
  // Load tour configuration from YAML
  const { tourSteps: configuredTourSteps, loading: tourConfigLoading, error: tourConfigError } = useTourConfig('quick_tour');
  
  // Use configured tour steps if available, otherwise fall back to the default steps
  const tourSteps = configuredTourSteps.length > 0 ? configuredTourSteps : fallbackTourSteps;
  
  // Log tour configuration details for debugging
  useEffect(() => {
    if (tourConfigError) {
      console.error("Error loading tour configuration:", tourConfigError);
      console.log("Using fallback tour steps");
    } else if (!tourConfigLoading) {
      console.log("Loaded tour steps from YAML:", configuredTourSteps);
      console.log("Using configured tour steps:", tourSteps);
    }
  }, [tourConfigError, tourConfigLoading, configuredTourSteps, tourSteps]);
  
  // Initialize AudioManager on component mount
  useEffect(() => {
    audioManagerRef.current = new AudioManager();
    return () => {
      // Cleanup audio on unmount
      if (audioManagerRef.current) {
        audioManagerRef.current.stopAudio();
      }
    };
  }, []);
  
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
      
      // Play intro audio if available
      const audioManager = audioManagerRef.current;
      if (currentStep.audioFile && audioManager) {
        audioManager.playAudio(currentStep.audioFile);
      }
    } else if (currentStep?.id === 'tour_appointments') {
      // Start the actual tour highlighting when reaching tour_appointments step
      setIsTourActive(true);
      setTourStepIndex(0);
      
      // Stop any previous audio and play first tour step audio with a delay
      const tourAudioManager = audioManagerRef.current;
      if (tourAudioManager) {
        tourAudioManager.stopAudio();
        
        setTimeout(() => {
          if (tourSteps[0].audioFile && tourAudioManager) {
            tourAudioManager.playAudio(tourSteps[0].audioFile);
          }
        }, 300);
      }
    } else if (currentStep?.id === 'tour_complete') {
      // End the tour when reaching completion step
      setIsTourActive(false);
      
      // Stop any playing audio first then play completion audio
      const audioManager = audioManagerRef.current;
      if (audioManager) {
        audioManager.stopAudio();
        
        setTimeout(() => {
          audioManager.playAudio('welcome/tour_complete.mp3');
        }, 300);
      }
    }
  }, [currentStep?.id]);

  // Handle tour step change
  const handleTourStepChange = (index: number) => {
    setTourStepIndex(index);
    
    // Stop any previous audio first
    const stepAudioManager = audioManagerRef.current;
    if (stepAudioManager) {
      stepAudioManager.stopAudio();
    }
    
    // Slight delay before playing the new audio
    setTimeout(() => {
      // Play audio for this step if available
      const currentTourStep = tourSteps[index];
      if (currentTourStep.audioFile && stepAudioManager) {
        console.log(`Playing audio for step ${index}: ${currentTourStep.audioFile}`);
        console.log(`Step details:`, currentTourStep);
        stepAudioManager.playAudio(currentTourStep.audioFile, undefined, (error) => {
          if (error) {
            console.error(`Error playing audio for step ${index}:`, error);
          }
        });
      } else {
        console.warn(`No audio file found for step ${index} or audio manager not initialized`, currentTourStep);
      }
    }, 300);
    
    // If this is the last step, prepare to end the tour
    if (index === tourSteps.length - 1) {
      // We'll let the user click "Finish Tour" to proceed
    }
  };

  // Handle tour completion
  const handleTourComplete = () => {
    setIsTourActive(false);
    
    // Stop any playing audio first
    const audioManager = audioManagerRef.current;
    if (audioManager) {
      audioManager.stopAudio();
      
      // Immediately show confetti view with debug log
      console.log('🎉 Showing tour complete view with confetti');
      setShowTourComplete(true);
      
      // Slight delay before playing completion audio
      setTimeout(() => {
        // Play the tour completion audio
        console.log('🔊 Playing tour completion audio');
        audioManager.playAudio('welcome/tour_complete.mp3');
      }, 300);
    } else {
      // If audio manager isn't available, just show the tour complete view
      setShowTourComplete(true);
    }
  };
  
  // Handle continuing after confetti
  const handleTourCompleteClose = () => {
    setShowTourComplete(false);
    
    // Continue with workflow
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
            useVoice={false} /* Disabled to avoid duplicate audio - workflow handles audio explicitly */
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
      {!isTourActive && !showTourComplete && (
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
      
      {/* Tour complete celebration UI - always render if showTourComplete is true */}
      {showTourComplete && (
        <div className="fixed inset-0 z-[12000] flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative z-[12001] bg-white p-8 rounded-xl shadow-2xl max-w-md w-11/12 text-center">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <ReactConfetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={false}
                numberOfPieces={1000}
                gravity={0.3}
              />
            </div>
            <div className="text-5xl mb-6">🎉</div>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Tour Complete!</h2>
            <p className="text-gray-700 mb-8">Congratulations! You've completed the quick tour of Premier Healthcare. Feel free to explore the platform on your own.</p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={handleTourCompleteClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};