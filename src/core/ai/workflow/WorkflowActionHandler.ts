/**
 * WorkflowActionHandler
 * Handles execution of workflow actions like navigation, form filling, etc.
 */
import { AssistantState } from '../WorkflowTypes';

export class WorkflowActionHandler {
  /**
   * Execute a list of actions defined in the workflow
   */
  public executeActions(actions: string[], state: AssistantState): AssistantState {
    let updatedState = { ...state };
    
    actions.forEach((actionStr) => {
      try {
        const [actionType, ...params] = actionStr.split(":");
        const joinedParams = params.join(":");

        switch (actionType) {
          case "navigate":
            updatedState = this.handleNavigate(joinedParams, updatedState);
            break;
          case "startWorkflow":
            updatedState = this.handleStartWorkflow(joinedParams, updatedState);
            break;
          case "fill":
            updatedState = this.handleFormFill(joinedParams, updatedState);
            break;
          case "interact":
            updatedState = this.handleInteraction(joinedParams, updatedState);
            break;
          case "condition":
            updatedState = this.handleCondition(joinedParams, updatedState);
            break;
          default:
            console.warn(`Unknown action type: ${actionType}`);
        }
      } catch (error) {
        console.error(`Error executing action '${actionStr}':`, error);
      }
    });
    
    return updatedState;
  }

  /**
   * Handle navigation action
   */
  private handleNavigate(path: string, state: AssistantState): AssistantState {
    console.log(`Navigation action: ${path}`);
    return {
      ...state,
      lastNavigation: path
    };
  }

  /**
   * Handle form filling action
   */
  private handleFormFill(params: string, state: AssistantState): AssistantState {
    try {
      const [formId, fieldId, value] = params.split(":");
      console.log(`Form fill action: form=${formId}, field=${fieldId}, value=${value}`);

      // Create a new copy of the state
      const newState = { ...state };
      
      // Initialize form data structure if needed
      if (!newState.formData) {
        newState.formData = {};
      }

      if (!newState.formData[formId]) {
        newState.formData[formId] = {};
      }

      // Set the form field value
      newState.formData[formId][fieldId] = value;
      
      return newState;
    } catch (error) {
      console.error(`Invalid form fill parameters: ${params}`, error);
      return state;
    }
  }

  /**
   * Handle UI interaction action
   */
  private handleInteraction(params: string, state: AssistantState): AssistantState {
    try {
      const [elementId, action] = params.split(":");
      console.log(`Interaction action: element=${elementId}, action=${action}`);
      
      // In a real implementation, this would trigger UI interactions
      // For example, clicking a button or opening a modal
      // document.getElementById(elementId)?.click();
      
      return state;
    } catch (error) {
      console.error(`Invalid interaction parameters: ${params}`, error);
      return state;
    }
  }

  /**
   * Handle starting a new workflow from an action
   */
  private handleStartWorkflow(workflowId: string, state: AssistantState): AssistantState {
    console.log(`Starting workflow from action: ${workflowId}`);
    
    return {
      ...state,
      pendingWorkflowId: workflowId
    };
  }

  /**
   * Handle conditional logic action
   */
  private handleCondition(params: string, state: AssistantState): AssistantState {
    try {
      const [check, thenAction, elseAction] = params.split(":");
      const conditionMet = this.evaluateCondition(check, state);

      if (conditionMet) {
        console.log(`Condition '${check}' met, executing: ${thenAction}`);
        const [actionType, ...actionParams] = thenAction.split(":");
        return this.executeActions([`${actionType}:${actionParams.join(":")}`], state);
      } else {
        console.log(`Condition '${check}' not met, executing: ${elseAction}`);
        const [actionType, ...actionParams] = elseAction.split(":");
        return this.executeActions([`${actionType}:${actionParams.join(":")}`], state);
      }
    } catch (error) {
      console.error(`Invalid condition parameters: ${params}`, error);
      return state;
    }
  }

  /**
   * Evaluate a condition string
   */
  private evaluateCondition(condition: string, state: AssistantState): boolean {
    // Simple condition evaluation
    if (condition.startsWith("has:")) {
      const key = condition.substring(4);
      return key in state.collectedInfo;
    } else if (condition.startsWith("eq:")) {
      const [key, value] = condition.substring(3).split("=");
      return state.collectedInfo[key] === value;
    } else if (condition.startsWith("page:")) {
      const page = condition.substring(5);
      return state.lastNavigation === page;
    }
    return false;
  }
}