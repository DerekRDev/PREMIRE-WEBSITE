/**
 * @deprecated This file is deprecated. 
 * Please import WorkflowEngine from '@/core/ai/workflow' instead.
 * The workflow system has been refactored into a modular architecture.
 * See documentation in /docs/ARCHITECTURE.md and /docs/REFACTORING.md
 */

import { WorkflowEngine as RefactoredWorkflowEngine } from '@/core/ai/workflow';

/**
 * @deprecated Use the new implementation from '@/core/ai/workflow' instead.
 */
export class WorkflowEngine extends RefactoredWorkflowEngine {
  constructor(workflows: any[]) {
    super(workflows);
    console.warn(
      'You are using the deprecated WorkflowEngine from services. ' +
      'Please migrate to the new implementation from "@/core/ai/workflow".'
    );
  }
}
