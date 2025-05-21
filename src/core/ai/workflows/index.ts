import { Workflow } from '../WorkflowTypes';

// Import all workflow categories
import * as welcomeWorkflows from './welcome';
import * as appointmentWorkflows from './appointments';
import * as paymentWorkflows from './payments';
import * as insuranceWorkflows from './insurance';
import * as tourWorkflows from './tours';

// Export individual workflows for direct access
export * from './welcome';
export * from './appointments';
export * from './payments';
export * from './insurance';
export * from './tours';

// Create a combined array of all workflows for the workflow engine
export const allWorkflows: Workflow[] = [
  // Welcome workflows
  welcomeWorkflows.welcomeWorkflow,
  
  // Appointment workflows
  appointmentWorkflows.scheduleWorkflow,
  
  // Payment workflows
  paymentWorkflows.paymentWorkflow,
  
  // Insurance workflows
  insuranceWorkflows.insuranceVerificationWorkflow,
  
  // Tour workflows
  tourWorkflows.quickTourWorkflow,
];