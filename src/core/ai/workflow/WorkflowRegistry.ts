/**
 * WorkflowRegistry
 * Manages loading and retrieving workflow definitions
 */
import { Workflow } from '../WorkflowTypes';

export class WorkflowRegistry {
  private workflows: Record<string, Workflow> = {};
  
  /**
   * Register workflows
   */
  public registerWorkflows(workflows: Workflow[]): void {
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
   * Get a workflow by ID
   */
  public getWorkflow(workflowId: string): Workflow | null {
    return this.workflows[workflowId] || null;
  }
  
  /**
   * Get a step from a workflow
   */
  public getStep(workflowId: string, stepId: string): Workflow['steps'][0] | null {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) return null;
    
    const step = workflow.steps.find((s) => s.id === stepId);
    return step || null;
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
   * Find a choice in a step
   */
  public findChoice(workflowId: string, stepId: string, choiceId: string): any {
    const step = this.getStep(workflowId, stepId);
    if (!step || !step.choices) return null;
    
    return step.choices.find((c) => c.id === choiceId);
  }
}