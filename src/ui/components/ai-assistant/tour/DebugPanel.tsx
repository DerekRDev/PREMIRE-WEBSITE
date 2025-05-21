/**
 * DebugPanel
 * A simple debug panel for development use
 */
import React from 'react';
import { WorkflowStep } from '@/core/ai/WorkflowTypes';

interface DebugPanelProps {
  state: any;
  currentStep: WorkflowStep | null;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ state, currentStep }) => {
  const handleDumpState = () => {
    console.log('Current state:', state);
    console.log('Current step:', currentStep);
  };

  return (
    <div className="mt-4 flex space-x-2 justify-center">
      <button 
        className="bg-gray-700 text-white px-3 py-1 rounded text-xs"
        onClick={handleDumpState}
        data-testid="debug-button"
        aria-label="Debug"
      >
        Debug
      </button>
    </div>
  );
};