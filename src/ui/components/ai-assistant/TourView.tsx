"use client";

import React, { useState, useEffect, useRef } from 'react';
import { TourHighlight } from './TourHighlight';
import { TourAudioService } from '@/services/TourAudioService';
import { TourInteractionManager } from '@/services/TourInteractionManager';

// Define a tour step
interface TourStep {
  selector?: string;
  elementId?: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  audioFile?: string; // Path to the audio file for this step
}

interface TourViewProps {
  onClose: () => void;
  onComplete: () => void;
  steps: TourStep[];
  currentStepIndex?: number;
  onStepChange?: (index: number) => void;
}

export const TourView: React.FC<TourViewProps> = ({
  onClose,
  onComplete,
  steps,
  currentStepIndex = 0,
  onStepChange,
}) => {
  const [activeStep, setActiveStep] = useState(currentStepIndex);
  const interactionManager = useRef(TourInteractionManager.getInstance());

  useEffect(() => {
    setActiveStep(currentStepIndex);
  }, [currentStepIndex]);

  // Handle navigation between steps
  const handleNext = () => {
    const nextStep = activeStep + 1;
    if (nextStep < steps.length) {
      const currentStepId = steps[activeStep]?.id || `step_${activeStep}`;
      const nextStepId = steps[nextStep]?.id || `step_${nextStep}`;
      
      // Use the interaction manager to handle next step navigation
      interactionManager.current.handleNextStep(
        currentStepId,
        nextStepId,
        (index) => {
          setActiveStep(index);
          if (onStepChange) {
            onStepChange(index);
          }
        },
        nextStep,
        steps
      );
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    const prevStep = activeStep - 1;
    if (prevStep >= 0) {
      const currentStepId = steps[activeStep]?.id || `step_${activeStep}`;
      
      // Use the interaction manager to handle previous step navigation
      interactionManager.current.handlePreviousStep(
        currentStepId,
        (index) => {
          setActiveStep(index);
          if (onStepChange) {
            onStepChange(index);
          }
        },
        prevStep,
        steps
      );
    }
  };

  const handleComplete = () => {
    // Use the interaction manager to handle tour completion
    interactionManager.current.handleTourComplete(onComplete);
  };
  
  const handleClose = () => {
    // Use the interaction manager to handle tour closing
    interactionManager.current.handleCloseTour(onClose);
  };

  // Don't render if no steps
  if (steps.length === 0) {
    return null;
  }

  const currentStep = steps[activeStep];

  return (
    <TourHighlight
      selector={currentStep.selector}
      elementId={currentStep.elementId}
      title={currentStep.title}
      description={currentStep.description}
      position={currentStep.position || 'bottom'}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onClose={handleClose}
      isLast={activeStep === steps.length - 1}
      isFirst={activeStep === 0}
    />
  );
};