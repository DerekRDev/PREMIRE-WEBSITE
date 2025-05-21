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
  id?: string; // Optional ID for the step
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

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      const tourAudioService = TourAudioService.getInstance();
      tourAudioService.stopAudio();
    };
  }, []);

  useEffect(() => {
    setActiveStep(currentStepIndex);
    
    // Ensure mobile menu is open when tour initializes or step changes
    setTimeout(() => {
      ensureMobileMenuOpen();
    }, 100);
  }, [currentStepIndex]);

  // Helper function to ensure mobile menu stays open during tour
  const ensureMobileMenuOpen = () => {
    const isMobileView = window.innerWidth < 768; // Matches the Tailwind md: breakpoint
    if (isMobileView) {
      // Check if mobile menu is closed (by looking for hidden class)
      const mobileMenu = document.querySelector('.md\\:hidden .px-2.pt-2.pb-3');
      const isMenuHidden = mobileMenu?.classList.contains('hidden');
      
      if (isMenuHidden) {
        // Find and click the menu toggle button to open it
        const menuButton = document.querySelector('.md\\:hidden button');
        if (menuButton && menuButton instanceof HTMLElement) {
          menuButton.click();
        }
      }
    }
  };

  // Helper function to get step identifier
  const getStepId = (step: TourStep, index: number) => {
    return step.id || `step_${index}`;
  };

  // Handle navigation between steps
  const handleNext = () => {
    const nextStep = activeStep + 1;
    if (nextStep < steps.length) {
      const currentStepId = getStepId(steps[activeStep], activeStep);
      const nextStepId = getStepId(steps[nextStep], nextStep);
      
      // Use the interaction manager to handle next step navigation
      interactionManager.current.handleNextStep(
        currentStepId,
        nextStepId,
        (index) => {
          setActiveStep(index);
          if (onStepChange) {
            onStepChange(index);
          }
          
          // Ensure mobile menu is open if needed for the next step
          setTimeout(() => {
            ensureMobileMenuOpen();
          }, 100);
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
      const currentStepId = getStepId(steps[activeStep], activeStep);
      
      // Use the interaction manager to handle previous step navigation
      interactionManager.current.handlePreviousStep(
        currentStepId,
        (index) => {
          setActiveStep(index);
          if (onStepChange) {
            onStepChange(index);
          }
          
          // Ensure mobile menu is open if needed for the previous step
          setTimeout(() => {
            ensureMobileMenuOpen();
          }, 100);
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