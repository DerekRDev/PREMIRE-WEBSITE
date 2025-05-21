"use client";

import React, { useState } from 'react';
import { useAIAssistant } from '@/ui/providers/ai-assistant/AIAssistantProvider';

interface AIAssistantButtonProps {
  className?: string;
}

/**
 * Floating button to activate the AI Assistant
 */
export const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({ className = "" }) => {
  const { isActive, initialize, state, startWorkflow, getAvailableWorkflows } = useAIAssistant();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  
  // Disable pulse effect after 5 seconds or when clicked
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowPulse(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    console.log('AIAssistantButton clicked');
    
    // Disable pulse animation when clicked
    setShowPulse(false);
    
    // Always initialize when clicked
    console.log('Initializing assistant');
    initialize();
    
    // Debug current state after initialization
    console.log('State after initialization:', state);
    
    // Log available workflows before starting
    const workflows = getAvailableWorkflows();
    console.log('Available workflows:', workflows);
    
    // Launch the welcome workflow
    console.log('Starting welcome workflow');
    try {
      const result = startWorkflow('welcome');
      console.log('Workflow started successfully, result:', result);
      console.log('State should now be updated with the workflow');
      
      // Print current state again
      setTimeout(() => {
        console.log('State after workflow start (timeout):', state);
      }, 100);
    } catch (error) {
      console.error('Error starting workflow:', error);
    }
    
    // For now, let's disable the MP3 sound to avoid overlap
    // We'll fix the audio issue after fixing the popup
    /*
    // Play intro audio if possible
    try {
      const audio = new Audio('/audio/welcome/intro.mp3');
      audio.play().catch(err => {
        console.error('Could not play intro audio:', err);
      });
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
    */
  };

  return (
    <div className="fixed bottom-4 right-4 z-50" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-gray-800 text-white text-sm rounded shadow-lg">
          Need help? Click to open Premier AI Assistant
        </div>
      )}
      
      <button
        className={`bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center ${className} transition-all hover:scale-105 relative`}
        onClick={handleClick}
        aria-label="Open AI Assistant"
      >
        {/* Pulsing effect */}
        {showPulse && (
          <span className="absolute inset-0 rounded-full bg-blue-400 opacity-75 animate-ping"></span>
        )}
        <div className="flex items-center">
          <span className="font-semibold text-lg">AI</span>
        </div>
        <span className="sr-only">Premier AI Assistant</span>
      </button>
    </div>
  );
};