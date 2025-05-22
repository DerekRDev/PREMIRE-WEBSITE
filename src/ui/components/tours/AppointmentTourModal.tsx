import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../design-system/components/Button';
import { AudioManager } from '../../../core/ai/AudioManager';

export interface TourStep {
  id: string;
  message: string;
  audioFile: string;
  isTyping: boolean;
}

interface AppointmentTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  steps: TourStep[];
  currentStep: number;
  onComplete: () => void;
  audioManager: AudioManager;
}

export const AppointmentTourModal: React.FC<AppointmentTourModalProps> = ({
  isOpen,
  onClose,
  steps,
  currentStep,
  onComplete,
  audioManager,
}) => {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [showNext, setShowNext] = useState(false);
  
  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  
  // Handle audio playback
  const playStepAudio = useCallback((step: TourStep) => {
    if (!step?.audioFile) return;
    
    audioManager.playAudio(
      step.audioFile,
      () => {
        // Audio completed callback
        setShowNext(true);
      },
      (error) => {
        console.error('Error playing audio:', error);
        // Ensure UI remains responsive even if audio fails
        setShowNext(true);
      }
    );
  }, [audioManager]);

  // Reset state and start audio when step changes
  useEffect(() => {
    setDisplayedMessage('');
    setShowNext(false);

    if (currentStepData) {
      playStepAudio(currentStepData);
    }

    // Cleanup function to stop audio when step changes or component unmounts
    return () => {
      audioManager.stopAudio();
    };
  }, [currentStep, currentStepData, playStepAudio, audioManager]);

  // Typing animation effect coordinated with audio
  useEffect(() => {
    if (!currentStepData?.isTyping) {
      setDisplayedMessage(currentStepData?.message || '');
      return;
    }

    let index = 0;
    const message = currentStepData.message;
    
    // Use a default typing speed that will complete before audio typically ends
    // Most audio clips are 3-5 seconds, so aim to complete typing in ~2.5 seconds
    const typingSpeed = Math.max(20, Math.min(100,
      (2500) / message.length
    ));
    
    const typingInterval = setInterval(() => {
      if (index <= message.length) {
        setDisplayedMessage(message.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [currentStepData, audioManager]);

  if (!isOpen) return null;

  const handleNext = () => {
    // Stop current audio before proceeding
    audioManager.stopAudio();
    
    if (isLastStep) {
      onComplete();
      onClose();
    } else {
      setShowNext(false);
      onComplete();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-100 max-w-xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-gray-100">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
              <span className="font-medium">
                {currentStep + 1}/{steps.length}
              </span>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="min-h-[100px] text-lg text-gray-700 leading-relaxed">
              {displayedMessage}
            </div>
            
            {/* Action Button */}
            {showNext && (
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleNext}
                  variant="primary"
                  size="large"
                >
                  {isLastStep ? 'Complete' : 'Next'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};