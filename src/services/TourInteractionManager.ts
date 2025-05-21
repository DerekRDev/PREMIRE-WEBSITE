/**
 * TourInteractionManager
 * Handles user interactions with the tour, ensuring consistent behavior
 * for actions like navigation, closing the tour, etc.
 * 
 * This service coordinates the various components to provide a robust user experience.
 */
import { TourAudioService } from './TourAudioService';
import { useAIAssistant } from '@/ui/providers/ai-assistant/AIAssistantProvider';

export class TourInteractionManager {
  private static instance: TourInteractionManager;
  private audioService: TourAudioService;
  private isNavigating: boolean = false;

  private constructor() {
    this.audioService = TourAudioService.getInstance();
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): TourInteractionManager {
    if (!TourInteractionManager.instance) {
      TourInteractionManager.instance = new TourInteractionManager();
    }
    return TourInteractionManager.instance;
  }

  /**
   * Handle next step navigation
   * @param currentStepId Current step ID
   * @param nextStepId Next step ID
   * @param onStepChange Callback for step change
   * @param nextIndex Next step index
   * @param steps Tour steps array
   */
  public handleNextStep(
    currentStepId: string,
    nextStepId: string | null,
    onStepChange: (index: number) => void,
    nextIndex: number,
    steps: any[]
  ): void {
    // Prevent rapid clicking
    if (this.isNavigating) return;
    this.isNavigating = true;

    // Stop any current audio first
    this.audioService.stopAudio();

    // Change to the next step
    onStepChange(nextIndex);

    // Play audio for the next step if available
    if (nextIndex < steps.length) {
      const nextStep = steps[nextIndex];
      if (nextStep?.audioFile) {
        const stepId = nextStep.id || `tour_step_${nextIndex}`;
        this.audioService.playStepAudio(stepId, nextStep.audioFile, () => {
          // Audio completed callback
          console.log(`Audio completed for step ${stepId}`);
        });
      }
    }

    // Reset navigation lock after a short delay
    setTimeout(() => {
      this.isNavigating = false;
    }, 300);
  }

  /**
   * Handle previous step navigation
   * @param currentStepId Current step ID
   * @param onStepChange Callback for step change
   * @param prevIndex Previous step index
   * @param steps Tour steps array
   */
  public handlePreviousStep(
    currentStepId: string,
    onStepChange: (index: number) => void,
    prevIndex: number,
    steps: any[]
  ): void {
    // Prevent rapid clicking
    if (this.isNavigating) return;
    this.isNavigating = true;

    // Stop any current audio first
    this.audioService.stopAudio();

    // Change to the previous step
    onStepChange(prevIndex);

    // Play audio for the previous step if available
    if (prevIndex >= 0 && prevIndex < steps.length) {
      const prevStep = steps[prevIndex];
      if (prevStep?.audioFile) {
        const stepId = prevStep.id || `tour_step_${prevIndex}`;
        this.audioService.playStepAudio(stepId, prevStep.audioFile, () => {
          // Audio completed callback
          console.log(`Audio completed for step ${stepId}`);
        });
      }
    }

    // Reset navigation lock after a short delay
    setTimeout(() => {
      this.isNavigating = false;
    }, 300);
  }

  /**
   * Handle tour completion
   * @param onComplete Completion callback
   */
  public handleTourComplete(onComplete: () => void): void {
    // Stop any current audio
    this.audioService.stopAudio();

    // Trigger the completion callback
    onComplete();
  }

  /**
   * Handle closing the tour
   * @param hideAssistant Function to hide the assistant UI
   */
  public handleCloseTour(hideAssistant: () => void): void {
    // Stop any current audio
    this.audioService.stopAudio();

    // Reset the audio service state
    this.audioService.reset();

    // Hide the assistant UI
    hideAssistant();
  }

  /**
   * Handle tour exit (when user clicks "Exit Tour" button)
   * @param hideAssistant Function to hide the assistant UI
   */
  public handleExitTour(hideAssistant: () => void): void {
    // Stop any current audio
    this.audioService.stopAudio();

    // Reset the audio service state
    this.audioService.reset();

    // Hide the assistant UI
    hideAssistant();
  }
}