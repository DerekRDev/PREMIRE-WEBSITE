/**
 * @deprecated Use the new implementation from './workflow/WorkflowEngine' instead
 * This file is maintained for backward compatibility during migration
 */

import { WorkflowEngine as NewWorkflowEngine } from './workflow/WorkflowEngine';
import type { Workflow, AssistantState, StepResult, ConversationMessage } from "./WorkflowTypes";

/**
 * Core engine for processing healthcare workflows.
 * Handles loading workflow definitions, tracking state, and executing actions.
 * 
 * @deprecated Use the new implementation from './workflow/WorkflowEngine' instead
 */
export class WorkflowEngine extends NewWorkflowEngine {
  constructor(workflows: Workflow[]) {
    super(workflows);
    console.warn(
      'You are using the deprecated WorkflowEngine class. ' +
      'Please migrate to the new implementation from "./workflow/WorkflowEngine".'
    );
  }
}