import { Workflow, ModalStep, TourState, WorkflowStep, Choice } from '../../WorkflowTypes';
import { appointmentTourConfig, TourStepConfig } from '../../../../config/appointmentTour';

/**
 * Tour Generator - Automatically creates workflow from configuration
 * 
 * This generator reads the appointmentTour.ts config and creates
 * the complete workflow structure dynamically.
 */

// Convert config step to workflow step
function configToWorkflowStep(step: TourStepConfig): WorkflowStep {
  return {
    id: step.id,
    displayType: "popup",
    text: step.text,
    audioFile: step.audioFile,
    choices: step.nextStepId 
      ? [{ id: "next_step", text: "Continue", nextStepId: step.nextStepId }]
      : [{ id: "complete", text: "Complete Tour" }]
  };
}

// Convert config step to modal step
function configToModalStep(step: TourStepConfig): ModalStep {
  return {
    id: step.id,
    message: step.text,
    audioFile: step.audioFile,
    isTyping: true
  };
}

// Generate the complete workflow from configuration
export function generateAppointmentTourWorkflow(): Workflow {
  const config = appointmentTourConfig;
  
  if (config.steps.length === 0) {
    throw new Error('Appointment tour configuration must have at least one step');
  }

  const workflow: Workflow = {
    id: config.id,
    name: config.name,
    description: config.description,
    initialStep: config.steps[0].id,
    
    // Generate workflow steps from config
    steps: config.steps.map(configToWorkflowStep),
    
    // Generate modal steps from config
    modalSteps: config.steps.map(configToModalStep),

    // Methods to handle modal state
    methods: {
      startTour: (state: TourState) => {
        state.isModalOpen = true;
        state.currentStepIndex = 0;
        return state;
      },

      nextStep: (state: TourState) => {
        if (state.currentStepIndex < config.steps.length - 1) {
          state.currentStepIndex++;
        } else {
          state.isModalOpen = false;
          state.currentStepIndex = 0;
        }
        return state;
      },

      endTour: (state: TourState) => {
        state.isModalOpen = false;
        state.currentStepIndex = 0;
        if (state.audioManager) {
          state.audioManager.stopAudio();
        }
        return state;
      }
    }
  };

  return workflow;
}

/**
 * Helper functions for integration with the appointment scheduler
 */

// Get step ID that should trigger when a specific scheduler action occurs
export function getStepForSchedulerAction(
  schedulerStep: 'SPECIALTY' | 'PROVIDER' | 'DATETIME' | 'DETAILS' | 'CONFIRMATION',
  action: 'specialty_select' | 'provider_select' | 'slot_select' | 'next_click'
): string | null {
  const step = appointmentTourConfig.steps.find(step => 
    step.triggerCondition?.schedulerStep === schedulerStep && 
    step.triggerCondition?.action === action
  );
  
  return step ? step.id : null;
}

// Get all step IDs in order (useful for step progression)
export function getStepIds(): string[] {
  return appointmentTourConfig.steps.map(step => step.id);
}

// Get step configuration by ID
export function getStepConfig(stepId: string): TourStepConfig | null {
  return appointmentTourConfig.steps.find(step => step.id === stepId) || null;
}

// Validate configuration
export function validateTourConfiguration(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const config = appointmentTourConfig;
  
  // Check for duplicate IDs
  const stepIds = config.steps.map(step => step.id);
  const duplicateIds = stepIds.filter((id, index) => stepIds.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    errors.push(`Duplicate step IDs found: ${duplicateIds.join(', ')}`);
  }
  
  // Check for invalid nextStepId references
  config.steps.forEach(step => {
    if (step.nextStepId && !stepIds.includes(step.nextStepId)) {
      errors.push(`Step "${step.id}" references invalid nextStepId: "${step.nextStepId}"`);
    }
  });
  
  // Check for missing required fields
  config.steps.forEach(step => {
    if (!step.id) errors.push('Step missing required field: id');
    if (!step.text) errors.push(`Step "${step.id}" missing required field: text`);
    if (!step.audioFile) errors.push(`Step "${step.id}" missing required field: audioFile`);
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}