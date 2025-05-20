/**
 * Core types for the AI Assistant system
 */

/**
 * Types of intents the AI can recognize
 */
export type PatientIntent = 
  | 'BOOK_APPOINTMENT'
  | 'RESCHEDULE_APPOINTMENT'
  | 'CANCEL_APPOINTMENT'
  | 'CHECK_IN'
  | 'PAY_BILL'
  | 'ADD_INSURANCE'
  | 'UPDATE_INSURANCE'
  | 'VERIFY_INSURANCE'
  | 'REQUEST_FINANCIAL_ASSISTANCE'
  | 'CHECK_COST'
  | 'UPDATE_PROFILE'
  | 'REQUEST_RECORDS'
  | 'SETUP_REFERRAL'
  | 'CHECK_LAB_RESULTS'
  | 'GENERAL_HELP'
  | 'EXIT_ASSISTANT';

/**
 * UI components that can be triggered by the AI
 */
export type AIUIComponentType = 
  | 'POPUP_MESSAGE'
  | 'CHOICE_SELECTOR'
  | 'FORM_ASSIST'
  | 'PROGRESS_INDICATOR'
  | 'VOICE_FEEDBACK'
  | 'NAVIGATION_HINT';

/**
 * Status of a conversation with the AI
 */
export type ConversationStatus = 
  | 'IDLE'
  | 'LISTENING'
  | 'PROCESSING'
  | 'SPEAKING'
  | 'AWAITING_INPUT'
  | 'NAVIGATING'
  | 'FORM_FILLING'
  | 'COMPLETED'
  | 'ERROR';

/**
 * A choice option presented to the user
 */
export interface ChoiceOption {
  id: string;
  label: string;
  description?: string;
  iconUrl?: string;
  action?: () => void;
  nextState?: string;
}

/**
 * Configuration for voice synthesis
 */
export interface VoiceConfig {
  voiceId: string;
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
  speed: number;
}

/**
 * State of the AI assistant
 */
export interface AIAssistantState {
  isActive: boolean;
  conversationStatus: ConversationStatus;
  currentIntent?: PatientIntent;
  detectedEntities: Record<string, any>;
  conversationHistory: ConversationMessage[];
  currentPath: string;
  lastUserInput?: string;
  lastAssistantResponse?: string;
  currentChoices?: ChoiceOption[];
  voiceEnabled: boolean;
  voiceConfig: VoiceConfig;
  sessionId: string;
  userProfile?: UserProfileReference;
}

/**
 * A message in the conversation
 */
export interface ConversationMessage {
  id: string;
  timestamp: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type: 'text' | 'voice' | 'choice' | 'action';
  intent?: PatientIntent;
  relatedEntities?: Record<string, any>;
}

/**
 * Reference to user profile for personalization
 */
export interface UserProfileReference {
  patientId: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  dateOfBirth?: string;
  preferredVoice?: string;
  assistantPreferences?: Record<string, any>;
  accessibilityNeeds?: string[];
}

/**
 * Result of an action taken by the AI
 */
export interface AIActionResult {
  success: boolean;
  message: string;
  navigationPath?: string;
  formData?: Record<string, any>;
  nextState?: Partial<AIAssistantState>;
  uiUpdate?: {
    type: AIUIComponentType;
    data: any;
  };
}

/**
 * Configuration for a workflow that can be executed by the AI
 */
export interface WorkflowConfig {
  id: string;
  name: string;
  description: string;
  triggerIntents: PatientIntent[];
  requiredEntities: string[];
  steps: WorkflowStep[];
  fallbackHandler?: (state: AIAssistantState) => AIActionResult;
}

/**
 * A step in a workflow
 */
export interface WorkflowStep {
  id: string;
  description: string;
  action: (state: AIAssistantState) => Promise<AIActionResult>;
  nextStepId?: string | ((result: AIActionResult) => string);
  errorHandler?: (error: Error, state: AIAssistantState) => AIActionResult;
}