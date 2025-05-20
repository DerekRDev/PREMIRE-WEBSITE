import { useState, useEffect } from 'react';

export const useTour = () => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const startTour = () => {
    console.log('Tour started');
    setIsTourActive(true);
    setCurrentStep(0);
  };

  const endTour = () => {
    console.log('Tour ended');
    setIsTourActive(false);
    setCurrentStep(0);
  };

  const nextStep = () => {
    console.log(`Moving to step ${currentStep + 1}`);
    setCurrentStep(prev => prev + 1);
  };

  useEffect(() => {
    if (process.env.DEBUG_TOUR === 'true') {
      console.log('Tour state:', { isTourActive, currentStep });
    }
  }, [isTourActive, currentStep]);

  return {
    isTourActive,
    currentStep,
    startTour,
    endTour,
    nextStep
  };
};
