"use client";

import React, { useState, useEffect } from 'react';
import { TourHighlight } from './TourHighlight';

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

  useEffect(() => {
    setActiveStep(currentStepIndex);
  }, [currentStepIndex]);

  // Handle navigation between steps
  const handleNext = () => {
    const nextStep = activeStep + 1;
    if (nextStep < steps.length) {
      setActiveStep(nextStep);
      if (onStepChange) {
        onStepChange(nextStep);
      }
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    const prevStep = activeStep - 1;
    if (prevStep >= 0) {
      setActiveStep(prevStep);
      if (onStepChange) {
        onStepChange(prevStep);
      }
    }
  };

  const handleComplete = () => {
    onComplete();
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
      onClose={onClose}
      isLast={activeStep === steps.length - 1}
      isFirst={activeStep === 0}
    />
  );
};