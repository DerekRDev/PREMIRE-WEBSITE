/**
 * WorkflowStateManager
 * Manages the state for workflows, including conversation history, UI state, etc.
 */
import { AssistantState, ConversationMessage, WorkflowStep } from '../WorkflowTypes';

export class WorkflowStateManager {
  private state: AssistantState;
  
  constructor(initialState?: Partial<AssistantState>) {
    this.state = {
      active: false,
      currentWorkflowId: null,
      currentStepId: null,
      conversationHistory: [],
      collectedInfo: {},
      audioStatus: "ready",
      uiState: "hidden",
      voiceConfig: {
        voiceId: "pNInz6obpgDQGcFmaJgB", // Default to Rachel voice
        enabled: true
      },
      ...initialState
    };
  }
  
  /**
   * Get the current state
   */
  public getState(): AssistantState {
    return { ...this.state };
  }
  
  /**
   * Update the state
   */
  public updateState(updates: Partial<AssistantState>): void {
    this.state = {
      ...this.state,
      ...updates
    };
  }
  
  /**
   * Reset state for a new workflow
   */
  public resetForWorkflow(workflowId: string, initialStepId: string): void {
    this.state = {
      ...this.state,
      active: true,
      currentWorkflowId: workflowId,
      currentStepId: initialStepId,
      conversationHistory: [],
      uiState: "active",
    };
  }
  
  /**
   * Add a message to the conversation history
   */
  public addAssistantMessage(text: string): void {
    const message: ConversationMessage = {
      role: "assistant",
      text: text,
      timestamp: Date.now(),
    };
    this.state.conversationHistory.push(message);
  }
  
  /**
   * Add a user choice to the conversation history
   */
  public addUserChoice(text: string, choiceId: string): void {
    const message: ConversationMessage = {
      role: "user",
      text: text,
      choiceId: choiceId,
      timestamp: Date.now(),
    };
    this.state.conversationHistory.push(message);
  }
  
  /**
   * Update state based on a workflow step
   */
  public updateStateFromStep(step: WorkflowStep): void {
    // Update UI state based on display type
    this.state.uiState = step.displayType;
    
    // Set audio status to playing if there's an audio file
    if (step.audioFile) {
      this.state.audioStatus = "playing";
    }
    
    // Add to conversation history if there's text
    if (step.text) {
      this.addAssistantMessage(step.text);
    }
  }
  
  /**
   * Store data from a choice
   */
  public storeChoiceData(data: Record<string, any>): void {
    this.state.collectedInfo = {
      ...this.state.collectedInfo,
      ...data,
    };
  }
  
  /**
   * Mark current audio as completed
   */
  public audioCompleted(): void {
    this.state.audioStatus = "completed";
  }
  
  /**
   * End the workflow
   */
  public endWorkflow(): void {
    this.state.uiState = "hidden";
  }
  
  /**
   * Check if there's a pending workflow to start
   */
  public hasPendingWorkflow(): boolean {
    return !!this.state.pendingWorkflowId;
  }
  
  /**
   * Get the pending workflow ID
   */
  public getPendingWorkflowId(): string | null | undefined {
    return this.state.pendingWorkflowId;
  }
  
  /**
   * Clear the pending workflow
   */
  public clearPendingWorkflow(): void {
    delete this.state.pendingWorkflowId;
  }
}