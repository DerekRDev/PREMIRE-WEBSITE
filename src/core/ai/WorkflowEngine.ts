import type { Workflow, AssistantState, StepResult, ConversationMessage } from "./WorkflowTypes";

/**
 * Core engine for processing healthcare workflows.
 * Handles loading workflow definitions, tracking state, and executing actions.
 */
export class WorkflowEngine {
  private workflows: Record<string, Workflow> = {};
  private currentWorkflowId: string | null = null;
  private currentStepId: string | null = null;
  private state: AssistantState = {
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
    }
  };

  /**
   * Initialize the workflow engine with workflow definitions
   */
  constructor(workflows: Workflow[]) {
    // Load workflows
    workflows.forEach((workflow) => {
      console.log(`Loading workflow: ${workflow.id}, steps: ${workflow.steps?.length || 0}`);
      if (workflow.steps?.length > 0) {
        console.log(`First step: ${workflow.steps[0].id}`);
      }
      this.workflows[workflow.id] = workflow;
    });

    console.log(`Loaded ${workflows.length} workflows: ${Object.keys(this.workflows).join(', ')}`);
  }

  /**
   * Start a specific workflow by ID
   */
  public startWorkflow(workflowId: string): StepResult {
    if (!this.workflows[workflowId]) {
      throw new Error(`Workflow '${workflowId}' not found`);
    }

    this.currentWorkflowId = workflowId;
    const workflow = this.workflows[workflowId];
    this.currentStepId = workflow.initialStep;

    // Reset state for new workflow
    this.state = {
      ...this.state,
      active: true,
      currentWorkflowId: workflowId,
      currentStepId: workflow.initialStep,
      conversationHistory: [],
      uiState: "active",
    };

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

    const workflow = this.workflows[this.currentWorkflowId];
    if (!workflow) {
      console.error(`Workflow '${this.currentWorkflowId}' not found`);
      console.log('Available workflows:', Object.keys(this.workflows));
      throw new Error(`Workflow '${this.currentWorkflowId}' not found`);
    }
    
    const step = workflow.steps.find((s) => s.id === this.currentStepId);

    if (!step) {
      console.error(`Step '${this.currentStepId}' not found in workflow '${this.currentWorkflowId}'`);
      console.log('Available steps:', workflow.steps.map(s => s.id));
      throw new Error(`Step '${this.currentStepId}' not found in workflow '${this.currentWorkflowId}'`);
    }

    console.log('Processing step:', step);
    
    // Execute beforeStep actions if any
    if (step.actions?.beforeStep) {
      console.log('Executing beforeStep actions:', step.actions.beforeStep);
      this.executeActions(step.actions.beforeStep);
    }

    // Add to conversation history
    if (step.text) {
      const message: ConversationMessage = {
        role: "assistant",
        text: step.text,
        timestamp: Date.now(),
      };
      this.state.conversationHistory.push(message);
      console.log('Added message to conversation history');
    }

    // Update UI state based on display type
    this.state.uiState = step.displayType;
    console.log('Updated UI state to:', step.displayType);

    // Set audio status to playing if there's an audio file
    if (step.audioFile) {
      this.state.audioStatus = "playing";
      console.log('Set audio status to playing for:', step.audioFile);
    }

    // Update state with workflow and step IDs
    this.state.currentWorkflowId = this.currentWorkflowId;
    this.state.currentStepId = step.id;
    this.state.active = true;
    
    console.log('Updated state:', {
      currentWorkflowId: this.state.currentWorkflowId,
      currentStepId: this.state.currentStepId,
      uiState: this.state.uiState,
      audioStatus: this.state.audioStatus,
      active: this.state.active
    });

    return {
      step,
      state: { ...this.state },
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
    
    const workflow = this.workflows[this.currentWorkflowId];
    if (!workflow) {
      console.error(`Workflow '${this.currentWorkflowId}' not found`);
      throw new Error(`Workflow '${this.currentWorkflowId}' not found`);
    }
    
    const step = workflow.steps.find((s) => s.id === this.currentStepId);

    if (!step) {
      console.error(`Step '${this.currentStepId}' not found in workflow '${this.currentWorkflowId}'`);
      throw new Error(`Step '${this.currentStepId}' not found in workflow '${this.currentWorkflowId}'`);
    }

    console.log('Current step:', step);
    console.log('Available choices:', step.choices);
    
    // Find the selected choice
    const choice = step.choices?.find((c) => c.id === choiceId);

    if (!choice) {
      console.error(`Choice '${choiceId}' not found in step '${this.currentStepId}'`);
      throw new Error(`Choice '${choiceId}' not found in step '${this.currentStepId}'`);
    }

    console.log('Selected choice:', choice);
    
    // Add user choice to conversation history
    const message: ConversationMessage = {
      role: "user",
      text: choice.text,
      choiceId: choiceId,
      timestamp: Date.now(),
    };
    this.state.conversationHistory.push(message);

    // Execute actions if any
    if (choice.actions) {
      console.log('Executing choice actions:', choice.actions);
      this.executeActions(choice.actions);
    }

    // Store any data from the choice
    if (choice.storeData) {
      console.log('Storing choice data:', choice.storeData);
      this.state.collectedInfo = {
        ...this.state.collectedInfo,
        ...choice.storeData,
      };
    }

    // Move to the next step
    const nextStepId = choice.nextStepId;
    console.log('Next step ID:', nextStepId);
    
    if (nextStepId) {
      this.currentStepId = nextStepId;
      return this.processCurrentStep();
    } else {
      // End of workflow
      console.log('End of workflow, hiding assistant');
      this.state.uiState = "hidden";
      return {
        step: null,
        state: { ...this.state },
        completed: true,
      };
    }
  }

  /**
   * Execute a list of actions defined in the workflow
   */
  private executeActions(actions: string[]): void {
    actions.forEach((actionStr) => {
      try {
        const [actionType, ...params] = actionStr.split(":");

        switch (actionType) {
          case "navigate":
            this.handleNavigate(params.join(":"));
            break;
          case "fill":
            this.handleFormFill(params.join(":"));
            break;
          case "interact":
            this.handleInteraction(params.join(":"));
            break;
          case "condition":
            this.handleCondition(params.join(":"));
            break;
          default:
            console.warn(`Unknown action type: ${actionType}`);
        }
      } catch (error) {
        console.error(`Error executing action '${actionStr}':`, error);
      }
    });
  }

  /**
   * Handle navigation action
   */
  private handleNavigate(path: string): void {
    console.log(`Navigation action: ${path}`);
    // In a real implementation, this would trigger navigation in the app
    this.state.lastNavigation = path;

    // For a Next.js application, you might use router here
    // router.push(path);
  }

  /**
   * Handle form filling action
   */
  private handleFormFill(params: string): void {
    try {
      const [formId, fieldId, value] = params.split(":");
      console.log(`Form fill action: form=${formId}, field=${fieldId}, value=${value}`);

      // Initialize form data structure if needed
      if (!this.state.formData) {
        this.state.formData = {};
      }

      if (!this.state.formData[formId]) {
        this.state.formData[formId] = {};
      }

      // Set the form field value
      this.state.formData[formId][fieldId] = value;
    } catch (error) {
      console.error(`Invalid form fill parameters: ${params}`, error);
    }
  }

  /**
   * Handle UI interaction action
   */
  private handleInteraction(params: string): void {
    try {
      const [elementId, action] = params.split(":");
      console.log(`Interaction action: element=${elementId}, action=${action}`);

      // In a real implementation, this would trigger UI interactions
      // For example, clicking a button or opening a modal
      // document.getElementById(elementId)?.click();
    } catch (error) {
      console.error(`Invalid interaction parameters: ${params}`, error);
    }
  }

  /**
   * Handle conditional logic action
   */
  private handleCondition(params: string): void {
    try {
      const [check, thenAction, elseAction] = params.split(":");
      const conditionMet = this.evaluateCondition(check);

      if (conditionMet) {
        console.log(`Condition '${check}' met, executing: ${thenAction}`);
        const [actionType, ...actionParams] = thenAction.split(":");
        this.executeActions([`${actionType}:${actionParams.join(":")}`]);
      } else {
        console.log(`Condition '${check}' not met, executing: ${elseAction}`);
        const [actionType, ...actionParams] = elseAction.split(":");
        this.executeActions([`${actionType}:${actionParams.join(":")}`]);
      }
    } catch (error) {
      console.error(`Invalid condition parameters: ${params}`, error);
    }
  }

  /**
   * Evaluate a condition string
   */
  private evaluateCondition(condition: string): boolean {
    // Simple condition evaluation
    if (condition.startsWith("has:")) {
      const key = condition.substring(4);
      return key in this.state.collectedInfo;
    } else if (condition.startsWith("eq:")) {
      const [key, value] = condition.substring(3).split("=");
      return this.state.collectedInfo[key] === value;
    } else if (condition.startsWith("page:")) {
      const page = condition.substring(5);
      return this.state.lastNavigation === page;
    }
    return false;
  }

  /**
   * Mark the current audio as completed
   */
  public audioCompleted(): void {
    this.state.audioStatus = "completed";
  }

  /**
   * Get a list of all available workflows with basic info
   */
  public getAvailableWorkflows(): Array<{ id: string; name: string; description?: string }> {
    return Object.values(this.workflows).map((workflow) => ({
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
    }));
  }

  /**
   * Get the current state
   */
  public getState(): AssistantState {
    return { ...this.state };
  }
}