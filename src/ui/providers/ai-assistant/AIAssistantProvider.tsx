"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WorkflowEngine } from '@/core/ai/WorkflowEngine';
import { TourAudioService } from '@/services/TourAudioService';
import { AIAssistantAnalytics } from '@/core/ai/AIAssistantAnalytics';
import type { Workflow, WorkflowStep, AssistantState } from '@/core/ai/WorkflowTypes';

// Define the context type
interface AIAssistantContextType {
  // State
  isActive: boolean;
  currentStep: WorkflowStep | null;
  state: AssistantState;

  // Methods
  initialize: () => void;
  shutdown: () => void;
  startWorkflow: (workflowId: string) => void;
  selectChoice: (choiceId: string) => void;
  getAvailableWorkflows: () => Array<{ id: string; name: string; description?: string }>;

  // Audio controls
  setMute: (muted: boolean) => void;
  setVolume: (volume: number) => void;

  // UI controls
  hideAssistant: () => void;
}

// Create the context with a default value
const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

// Props for the provider component
interface AIAssistantProviderProps {
  children: React.ReactNode;
  workflows: Workflow[];
  audioBasePath?: string;
  analyticsEnabled?: boolean;
}

// Provider component
export const AIAssistantProvider: React.FC<AIAssistantProviderProps> = ({
  children,
  workflows,
  audioBasePath = "/audio",
  analyticsEnabled = true,
}) => {
  // Initialize services
  const [engine] = useState(() => new WorkflowEngine(workflows));
  const [tourAudioService] = useState(() => TourAudioService.getInstance());
  const [analytics] = useState(() => AIAssistantAnalytics.getInstance());

  // State
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<WorkflowStep | null>(null);
  const [state, setState] = useState<AssistantState>(engine.getState());

  // Set analytics enabled/disabled
  useEffect(() => {
    if (analyticsEnabled) {
      analytics.enable();
    } else {
      analytics.disable();
    }
  }, [analytics, analyticsEnabled]);

  // Initialize the assistant
  const initialize = useCallback(() => {
    setIsActive(true);
    analytics.trackEvent({
      type: 'assistant_open',
    });
    console.log("AI Assistant initialized");
  }, [analytics]);

  // Shutdown the assistant
  const shutdown = useCallback(() => {
    setIsActive(false);
    tourAudioService.stopAudio();
    analytics.trackEvent({
      type: 'assistant_close',
    });
    console.log("AI Assistant shutdown");
  }, [tourAudioService, analytics]);

  // Start a workflow
  const startWorkflow = useCallback(
    (workflowId: string) => {
      try {
        console.log('Starting workflow:', workflowId);
        console.log('Available workflows:', Object.keys(engine.getAvailableWorkflows()));
        
        // Ensure we have the workflow before starting
        const availableWorkflows = engine.getAvailableWorkflows();
        const workflowExists = availableWorkflows.some(w => w.id === workflowId);
        
        if (!workflowExists) {
          console.error(`Workflow ${workflowId} not found in available workflows`);
          return;
        }
        
        // Start the workflow
        const result = engine.startWorkflow(workflowId);
        console.log('Workflow started, result:', result);
        
        if (result && result.step) {
          console.log('Setting current step:', result.step);
          setCurrentStep(result.step);
          
          console.log('Setting state:', result.state);
          setState(result.state);

          // Track workflow start
          analytics.trackEvent({
            type: 'workflow_start',
            workflowId,
            stepId: result.step?.id,
          });

          // Play audio if available
          if (result.step?.audioFile) {
            console.log('Playing audio:', result.step.audioFile);
            tourAudioService.playStepAudio(result.step.id, result.step.audioFile, () => {
              console.log('Audio completed');
              engine.audioCompleted();
              setState(engine.getState());
            });

            // Track audio played
            analytics.trackEvent({
              type: 'audio_played',
              workflowId,
              stepId: result.step.id,
              audioFile: result.step.audioFile,
            });
          }
        } else {
          console.error('No step returned from workflow engine');
        }
      } catch (error) {
        console.error("Error starting workflow:", error);
        console.error("Stack trace:", error instanceof Error ? error.stack : '');
        // Track error
        analytics.trackEvent({
          type: 'error',
          workflowId,
          errorMessage: error instanceof Error ? error.message : String(error),
        });
      }
    },
    [engine, tourAudioService, analytics],
  );

  // Select a choice
  const selectChoice = useCallback(
    (choiceId: string) => {
      try {
        console.log('AIAssistantProvider.selectChoice called with:', choiceId);
        console.log('Current state:', JSON.stringify(state, null, 2));
        
        const currentWorkflowId = state.currentWorkflowId || '';
        const currentStepId = state.currentStepId || '';

        console.log(`Current workflow: ${currentWorkflowId}, current step: ${currentStepId}`);

        // Track choice selected
        analytics.trackEvent({
          type: 'choice_selected',
          workflowId: currentWorkflowId,
          stepId: currentStepId,
          choiceId,
        });

        console.log('Calling engine.selectChoice with:', choiceId);
        const result = engine.selectChoice(choiceId);
        console.log('Result from engine.selectChoice:', result);
        
        setCurrentStep(result.step);
        setState(result.state);

        // Play audio if available
        if (result.step?.audioFile) {
          console.log('Playing audio:', result.step.audioFile);
          tourAudioService.playStepAudio(result.step.id, result.step.audioFile, () => {
            engine.audioCompleted();
            setState(engine.getState());
          });

          // Track audio played
          analytics.trackEvent({
            type: 'audio_played',
            workflowId: currentWorkflowId,
            stepId: result.step.id,
            audioFile: result.step.audioFile,
          });
        }

        // Handle workflow completion
        if (result.completed) {
          console.log("Workflow completed");
          analytics.trackEvent({
            type: 'workflow_complete',
            workflowId: currentWorkflowId,
          });
        }
      } catch (error) {
        console.error("Error selecting choice:", error);
        console.error("Error details:", error instanceof Error ? error.stack : String(error));
        
        // Track error
        analytics.trackEvent({
          type: 'error',
          workflowId: state.currentWorkflowId || '',
          stepId: state.currentStepId || '',
          choiceId,
          errorMessage: error instanceof Error ? error.message : String(error),
        });
      }
    },
    [engine, tourAudioService, analytics, state],
  );

  // Get available workflows
  const getAvailableWorkflows = useCallback(() => {
    return engine.getAvailableWorkflows();
  }, [engine]);

  // Set mute state
  const setMute = useCallback(
    (muted: boolean) => {
      tourAudioService.setMute(muted);
    },
    [tourAudioService],
  );

  // Set volume
  const setVolume = useCallback(
    (volume: number) => {
      tourAudioService.setVolume(volume);
    },
    [tourAudioService],
  );

  // Hide the assistant
  const hideAssistant = useCallback(() => {
    analytics.trackEvent({
      type: 'assistant_close',
    });
    setState((prevState) => ({
      ...prevState,
      uiState: "hidden",
    }));
  }, [analytics]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      tourAudioService.stopAudio();
    };
  }, [tourAudioService]);

  // Context value
  const contextValue: AIAssistantContextType = {
    isActive,
    currentStep,
    state,
    initialize,
    shutdown,
    startWorkflow,
    selectChoice,
    getAvailableWorkflows,
    setMute,
    setVolume,
    hideAssistant,
  };

  return <AIAssistantContext.Provider value={contextValue}>{children}</AIAssistantContext.Provider>;
};

// Custom hook to use the AI Assistant context
export const useAIAssistant = (): AIAssistantContextType => {
  const context = useContext(AIAssistantContext);

  if (context === undefined) {
    throw new Error("useAIAssistant must be used within an AIAssistantProvider");
  }

  return context;
};