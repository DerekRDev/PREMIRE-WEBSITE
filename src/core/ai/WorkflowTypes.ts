/**
 * TypeScript interfaces for the AI Patient Assistant workflow schema
 */

import { AudioManager } from './AudioManager';

// Tour state for modal-based workflows
export interface TourState {
  isModalOpen: boolean;
  currentStepIndex: number;
  audioManager: AudioManager | null;
}

// Step definition for modal-based tours
export interface ModalStep {
  id: string;
  message: string;
  audioFile: string;
  isTyping: boolean;
}

// Main workflow definition
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  initialStep: string;
  steps?: WorkflowStep[];
  modalSteps?: ModalStep[];
  initialState?: TourState;
  methods?: {
    startTour?: (state: TourState) => TourState;
    nextStep?: (state: TourState) => TourState;
    endTour?: (state: TourState) => TourState;
    [key: string]: ((state: TourState) => TourState) | undefined;
  };
}

// Step in a workflow
export interface WorkflowStep {
  id: string;
  displayType: "popup" | "calendar" | "celebration" | "form" | "hidden";
  text: string;
  audioFile?: string;
  choices?: Choice[];
  actions?: {
    beforeStep?: string[];
    afterStep?: string[];
  };
}

// Choice option in a step
export interface Choice {
  id: string;
  text: string;
  iconUrl?: string;
  nextStepId: string | null;
  storeData?: Record<string, any>;
  actions?: string[];
}

// Assistant state
export interface AssistantState {
  active: boolean;
  currentWorkflowId: string | null;
  currentStepId: string | null;
  conversationHistory: ConversationMessage[];
  collectedInfo: Record<string, any>;
  audioStatus: "ready" | "playing" | "completed" | "error";
  uiState: "hidden" | "active" | "popup" | "calendar" | "celebration" | "form";
  lastNavigation?: string;
  formData?: Record<string, Record<string, any>>;
  pendingWorkflowId?: string; // Used for starting a new workflow from an action
  voiceConfig?: {
    voiceId: string;
    enabled: boolean;
  };
}

// Message in conversation history
export interface ConversationMessage {
  role: "assistant" | "user";
  text: string;
  choiceId?: string;
  timestamp: number;
}

// Result of processing a step
export interface StepResult {
  step: WorkflowStep | null;
  state: AssistantState;
  completed?: boolean;
}