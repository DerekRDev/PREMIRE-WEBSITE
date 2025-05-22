import { Workflow } from '../../WorkflowTypes';
import { generateAppointmentTourWorkflow, validateTourConfiguration } from './appointmentTourGenerator';

/**
 * Appointment Booking Tour Workflow
 * 
 * This workflow is now automatically generated from the configuration file:
 * /src/config/appointmentTour.ts
 * 
 * To modify the tour:
 * 1. Edit /src/config/appointmentTour.ts
 * 2. Update text, audio files, or reorder steps
 * 3. The workflow will automatically reflect your changes
 * 
 * No need to edit this file directly!
 */

// Validate configuration on import
const validation = validateTourConfiguration();
if (!validation.isValid) {
  console.error('Appointment tour configuration errors:', validation.errors);
  throw new Error(`Invalid appointment tour configuration: ${validation.errors.join(', ')}`);
}

// Generate and export the workflow
export const appointmentBookingWorkflow: Workflow = generateAppointmentTourWorkflow();

// Re-export helper functions for easy access
export { 
  getStepForSchedulerAction, 
  getStepIds, 
  getStepConfig 
} from './appointmentTourGenerator';