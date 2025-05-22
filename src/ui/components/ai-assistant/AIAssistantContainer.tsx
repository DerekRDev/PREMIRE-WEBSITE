'use client';

import React, { useEffect } from 'react';
import { useAIAssistant } from '@/ui/providers/ai-assistant/AIAssistantProvider';
import { TourAudioService } from '@/services/TourAudioService';
import { 
  useTourManager, 
  ViewRenderer, 
  useTourConfigProvider, 
  TourCompleteView
} from './tour';
import { TourView } from './TourView';

/**
 * Main container for the AI Assistant UI
 * Orchestrates the different components and manages application flow
 */
export const AIAssistantContainer: React.FC = () => {
  // Get the AI Assistant context
  const { state, currentStep, selectChoice, hideAssistant } = useAIAssistant();
  
  // Load tour configuration based on current workflow
  const currentTourId = state.currentWorkflowId === 'appointment_booking_tour' ? 'appointment_booking_tour' : 'quick_tour';
  const { tourSteps } = useTourConfigProvider(currentTourId);
  
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
  if (!currentStep || state.uiState === "hidden") {
    return null;
  }

  // Check if this is the appointment booking tour (non-blocking)
  const isAppointmentBookingTour = state.currentWorkflowId === 'appointment_booking_tour';
  
  return (
    <>
      {/* Regular assistant UI - only show blocking overlay for non-appointment tours */}
      {!tourState.isActive && !tourState.showTourComplete && !isAppointmentBookingTour && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn transition-opacity duration-300">
          <div className="max-w-md w-full mx-4 transform animate-slideUp transition-transform duration-300 hover:scale-102">
            {/* Render appropriate view based on current step */}
            <ViewRenderer 
              currentStep={currentStep} 
              onChoiceSelected={selectChoice} 
              onClose={hideAssistant} 
            />
            
          </div>
        </div>
      )}
      
      {/* Appointment booking tour - non-blocking popup positioned to side */}
      {!tourState.isActive && !tourState.showTourComplete && isAppointmentBookingTour && (
        <div className="fixed inset-0 pointer-events-none z-[9999] animate-fadeIn transition-opacity duration-300">
          <div className="absolute top-1/2 right-8 transform -translate-y-1/2 pointer-events-auto">
            <div className="max-w-sm w-full transform animate-slideInRight transition-all duration-300 hover:translate-x-[-4px]">
              {/* Render appropriate view based on current step */}
              <ViewRenderer 
                currentStep={currentStep} 
                onChoiceSelected={selectChoice} 
                onClose={hideAssistant} 
              />
              
            </div>
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
          tourType={currentTourId}
        />
      )}
      
      {/* Tour complete celebration UI */}
      {tourState.showTourComplete && (
        <div className="animate-bounceIn">
          <TourCompleteView onClose={handleTourCompleteClose} />
        </div>
      )}
    </>
  );
};