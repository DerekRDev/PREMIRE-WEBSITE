import React, { useEffect, useState } from 'react';
// Import from WorkflowTypes instead of local hook
import { Choice } from '@/core/ai/WorkflowTypes';
import { getElevenLabsService } from '@/infrastructure/services/ElevenLabsService';

interface PopupMessageUpdatedProps {
  text: string;
  choices: Choice[];
  onChoiceSelected: (choiceId: string) => void;
  onClose: () => void;
  useVoice?: boolean;
  voiceId?: string;
}

export const PopupMessageUpdated: React.FC<PopupMessageUpdatedProps> = ({
  text,
  choices,
  onChoiceSelected,
  onClose,
  useVoice = true,
  voiceId
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Handle voice synthesis for the message
  // Temporarily disabled to avoid duplicate audio with workflow audio files
  useEffect(() => {
    if (text && useVoice) {
      // Simulate speaking state for UI indicators
      setIsSpeaking(true);
      
      // Set a timeout to simulate speech completion
      const timer = setTimeout(() => {
        setIsSpeaking(false);
      }, 5000); // Simulate 5 seconds of speech
      
      return () => clearTimeout(timer);
      
      /* Temporarily disabled
      const elevenLabsService = getElevenLabsService();
      elevenLabsService.speak(text, { voiceId })
        .then(() => {
          setIsSpeaking(false);
        })
        .catch(error => {
          console.error('Error speaking message:', error);
          setIsSpeaking(false);
        });
      */
    }
  }, [text, useVoice]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
      <p className="mb-4">{text}</p>
      
      {/* Voice indicator */}
      {isSpeaking && (
        <div className="mb-4 flex items-center">
          <div className="relative w-16 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="absolute inset-0 flex space-x-1 px-1 items-center">
              <div className="w-1 h-2 bg-blue-600 rounded-full animate-waveform-1"></div>
              <div className="w-1 h-1 bg-blue-600 rounded-full animate-waveform-2"></div>
              <div className="w-1 h-3 bg-blue-600 rounded-full animate-waveform-3"></div>
              <div className="w-1 h-1 bg-blue-600 rounded-full animate-waveform-2"></div>
              <div className="w-1 h-2 bg-blue-600 rounded-full animate-waveform-1"></div>
            </div>
          </div>
          <span className="ml-2 text-xs text-gray-500">Speaking...</span>
        </div>
      )}
      
      <div className="flex flex-col space-y-2">
        {choices.map(choice => (
          <button
            key={choice.id}
            onClick={() => onChoiceSelected(choice.id)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isSpeaking}
          >
            {choice.text}
          </button>
        ))}
      </div>
      <button 
        onClick={onClose} 
        className="mt-4 text-gray-500"
        disabled={isSpeaking}
      >
        Close
      </button>
    </div>
  );
};
