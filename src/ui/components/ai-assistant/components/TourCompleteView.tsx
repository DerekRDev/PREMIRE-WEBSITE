'use client';

import React, { useEffect } from 'react';
import { ConfettiEffect } from './ConfettiEffect';
import { Choice } from '@/core/ai/WorkflowTypes';

interface TourCompleteViewProps {
  text: string;
  choices?: Choice[];
  onChoiceSelected: (choiceId: string) => void;
  onClose: () => void;
}

/**
 * Special view shown when a tour is completed, with confetti effect
 */
export const TourCompleteView: React.FC<TourCompleteViewProps> = ({
  text,
  choices = [],
  onChoiceSelected,
  onClose
}) => {
  // Log when component renders for debugging
  console.log('🎉 TourCompleteView rendering with text:', text);
  
  // Force confetti to render
  useEffect(() => {
    console.log('🎊 TourCompleteView mounted - confetti should appear');
  }, []);
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[10002]">
      <ConfettiEffect duration={6000} />
      
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full z-10 text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-blue-600 mb-3">Tour Complete!</h3>
        <p className="text-gray-700 mb-6">{text}</p>
        
        <div className="flex justify-center">
          {choices.length > 0 ? (
            <div className="space-y-2 w-full">
              {choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => onChoiceSelected(choice.id)}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex space-x-4 justify-center">
              <button
                onClick={onClose}
                className="py-2 px-6 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow transition-colors duration-200"
              >
                Exit Tour
              </button>
              <button
                onClick={onClose}
                className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors duration-200"
              >
                Finish Tour
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};