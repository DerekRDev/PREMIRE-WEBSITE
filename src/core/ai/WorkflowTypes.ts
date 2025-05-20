/**
 * TypeScript interfaces for the AI Patient Assistant workflow schema
 */

// Main workflow definition
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  initialStep: string;
  steps: WorkflowStep[];
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