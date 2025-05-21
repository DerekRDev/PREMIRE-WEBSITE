/**
 * WorkflowEngine
 * Main integration point that orchestrates workflow execution
 * using specialized components for state management, action handling, etc.
 */
import { Workflow, StepResult } from '../WorkflowTypes';
import { WorkflowRegistry } from './WorkflowRegistry';
import { WorkflowStateManager } from './WorkflowStateManager';
import { WorkflowActionHandler } from './WorkflowActionHandler';

export class WorkflowEngine {
  private registry: WorkflowRegistry;
  private stateManager: WorkflowStateManager;
  private actionHandler: WorkflowActionHandler;
  
  private currentWorkflowId: string | null = null;
  private currentStepId: string | null = null;

  /**
   * Initialize the workflow engine with workflow definitions
   */
  constructor(workflows: Workflow[]) {
    this.registry = new WorkflowRegistry();
    this.stateManager = new WorkflowStateManager();
    this.actionHandler = new WorkflowActionHandler();
    
    // Register workflows
    this.registry.registerWorkflows(workflows);
  }

  /**
   * Start a specific workflow by ID
   */
  public startWorkflow(workflowId: string): StepResult {
    const workflow = this.registry.getWorkflow(workflowId);
    if (!workflow) {
      throw new Error(`Workflow '${workflowId}' not found`);
    }

    this.currentWorkflowId = workflowId;
    this.currentStepId = workflow.initialStep;

    // Reset state for new workflow
    this.stateManager.resetForWorkflow(workflowId, workflow.initialStep);

    // Get and process the initial step
    return this.processCurrentStep();
  }

  /**
   * Process the current step and return its data
   */
  public processCurrentStep(): StepResult {
    console.log('WorkflowEngine.processCurrentStep called');
    console.log('Current workflow ID:', this.currentWorkflowId);
    console.log('Current step ID:', this.currentStepId);
    
    if (!this.currentWorkflowId || !this.currentStepId) {
      console.error("No active workflow or step");
      throw new Error("No active workflow or step");
    }

    const workflow = this.registry.getWorkflow(this.currentWorkflowId);
    if (!workflow) {
      console.error(`Workflow '${this.currentWorkflowId}' not found`);
      throw new Error(`Workflow '${this.currentWorkflowId}' not found`);
    }
    
    const step = this.registry.getStep(this.currentWorkflowId, this.currentStepId);
    if (!step) {
      console.error(`Step '${this.currentStepId}' not found in workflow '${this.currentWorkflowId}'`);
      throw new Error(`Step '${this.currentStepId}' not found in workflow '${this.currentWorkflowId}'`);
    }

    console.log('Processing step:', step);
    
    // Execute beforeStep actions if any
    if (step.actions?.beforeStep) {
      console.log('Executing beforeStep actions:', step.actions.beforeStep);
      const updatedState = this.actionHandler.executeActions(
        step.actions.beforeStep, 
        this.stateManager.getState()
      );
      this.stateManager.updateState(updatedState);
    }

    // Update state based on step properties
    this.stateManager.updateStateFromStep(step);

    // Update current IDs in state
    this.stateManager.updateState({
      currentWorkflowId: this.currentWorkflowId,
      currentStepId: this.currentStepId,
      active: true,
    });
    
    const currentState = this.stateManager.getState();
    console.log('Updated state:', {
      currentWorkflowId: currentState.currentWorkflowId,
      currentStepId: currentState.currentStepId,
      uiState: currentState.uiState,
      audioStatus: currentState.audioStatus,
      active: currentState.active
    });

    return {
      step,
      state: currentState,
    };
  }

  /**
   * Process a user's choice selection and advance to the next step
   */
  public selectChoice(choiceId: string): StepResult {
    console.log('WorkflowEngine.selectChoice called with:', choiceId);
    
    if (!this.currentWorkflowId || !this.currentStepId) {
      console.error("No active workflow or step");
      throw new Error("No active workflow or step");
    }

    console.log(`Current workflow: ${this.currentWorkflowId}, current step: ${this.currentStepId}`);
    
    const step = this.registry.getStep(this.currentWorkflowId, this.currentStepId);
    if (!step) {
      console.error(`Step '${this.currentStepId}' not found in workflow '${this.currentWorkflowId}'`);
      throw new Error(`Step '${this.currentStepId}' not found in workflow '${this.currentWorkflowId}'`);
    }

    console.log('Current step:', step);
    console.log('Available choices:', step.choices);
    
    // Find the selected choice
    const choice = this.registry.findChoice(this.currentWorkflowId, this.currentStepId, choiceId);
    if (!choice) {
      console.error(`Choice '${choiceId}' not found in step '${this.currentStepId}'`);
      throw new Error(`Choice '${choiceId}' not found in step '${this.currentStepId}'`);
    }

    console.log('Selected choice:', choice);
    
    // Add user choice to conversation history
    this.stateManager.addUserChoice(choice.text, choiceId);

    // Execute actions if any
    if (choice.actions) {
      console.log('Executing choice actions:', choice.actions);
      const updatedState = this.actionHandler.executeActions(
        choice.actions, 
        this.stateManager.getState()
      );
      this.stateManager.updateState(updatedState);
    }

    // Store any data from the choice
    if (choice.storeData) {
      console.log('Storing choice data:', choice.storeData);
      this.stateManager.storeChoiceData(choice.storeData);
    }

    // Move to the next step
    const nextStepId = choice.nextStepId;
    console.log('Next step ID:', nextStepId);
    
    // Check if we have a pending workflow to start
    if (this.stateManager.hasPendingWorkflow()) {
      const workflowToStart = this.stateManager.getPendingWorkflowId();
      if (!workflowToStart) {
        throw new Error('Pending workflow ID is undefined');
      }
      
      console.log(`Starting pending workflow: ${workflowToStart}`);
      
      // Clear the pending workflow
      this.stateManager.clearPendingWorkflow();
      
      // Start the new workflow and return its result
      return this.startWorkflow(workflowToStart);
    }
    // Continue with normal flow if no pending workflow
    else if (nextStepId) {
      this.currentStepId = nextStepId;
      return this.processCurrentStep();
    } else {
      // End of workflow
      console.log('End of workflow, hiding assistant');
      this.stateManager.endWorkflow();
      
      return {
        step: null,
        state: this.stateManager.getState(),
        completed: true,
      };
    }
  }

  /**
   * Mark the current audio as completed
   */
  public audioCompleted(): void {
    this.stateManager.audioCompleted();
  }

  /**
   * Get a list of all available workflows with basic info
   */
  public getAvailableWorkflows(): Array<{ id: string; name: string; description?: string }> {
    return this.registry.getAvailableWorkflows();
  }

  /**
   * Get the current state
   */
  public getState(): any {
    return this.stateManager.getState();
  }
}