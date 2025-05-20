export class WorkflowEngine {
  private static instance: WorkflowEngine;
  private currentWorkflow: string | null = null;

  private constructor() {}

  public static getInstance(): WorkflowEngine {
    if (!WorkflowEngine.instance) {
      WorkflowEngine.instance = new WorkflowEngine();
    }
    return WorkflowEngine.instance;
  }

  public startWorkflow(workflowName: string): void {
    console.log(`Starting workflow: ${workflowName}`);
    this.currentWorkflow = workflowName;
  }

  public getCurrentWorkflow(): string | null {
    return this.currentWorkflow;
  }
}
