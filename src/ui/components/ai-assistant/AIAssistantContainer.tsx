'use client';

import React, { useEffect } from 'react';
import { useAIAssistant } from '@/ui/providers/ai-assistant/AIAssistantProvider';
import { TourAudioService } from '@/services/TourAudioService';
import { 
  useTourManager, 
  ViewRenderer, 
  useTourConfigProvider, 
  TourCompleteView, 
  DebugPanel 
} from './tour';
import { TourView } from './TourView';

/**
 * Main container for the AI Assistant UI
 * Orchestrates the different components and manages application flow
 */
export const AIAssistantContainer: React.FC = () => {
  // Get the AI Assistant context
  const { state, currentStep, selectChoice, hideAssistant } = useAIAssistant();
  
  // Load tour configuration
  const { tourSteps } = useTourConfigProvider('quick_tour');
  
  // Initialize tour audio service
  const tourAudioService = TourAudioService.getInstance();
  
  // Initialize tour manager
  const {
    tourState,
    handleTourStepChange,
    handleTourCompleteAction,
    handleTourCompleteClose,
    handleCloseTour,
  } = useTourManager({
    currentWorkflowStep: currentStep,
    tourSteps,
    onHideAssistant: hideAssistant,
    onSelectChoice: selectChoice,
  });
  
  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      tourAudioService.stopAudio();
    };
  }, []);
  
  // Handle rendering conditions
  if (!currentStep) {
    console.log('AIAssistantContainer: not rendering - no currentStep');
    return null;
  }
  
  if (state.uiState === "hidden") {
    console.log('AIAssistantContainer: not rendering - state is hidden');
    return null;
  }
  
  console.log('AIAssistantContainer: rendering content with displayType:', currentStep.displayType);

  return (
    <>
      {/* Regular assistant UI */}
      {!tourState.isActive && !tourState.showTourComplete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="max-w-md w-full mx-4">
            {/* Render appropriate view based on current step */}
            <ViewRenderer 
              currentStep={currentStep} 
              onChoiceSelected={selectChoice} 
              onClose={hideAssistant} 
            />
            
            {/* Debug controls */}
            <DebugPanel state={state} currentStep={currentStep} />
          </div>
        </div>
      )}

      {/* Tour highlighting UI */}
      {tourState.isActive && (
        <TourView
          steps={tourSteps}
          currentStepIndex={tourState.currentStepIndex}
          onStepChange={handleTourStepChange}
          onClose={handleCloseTour}
          onComplete={handleTourCompleteAction}
        />
      )}
      
      {/* Tour complete celebration UI */}
      {tourState.showTourComplete && (
        <TourCompleteView onClose={handleTourCompleteClose} />
      )}
    </>
  );
};