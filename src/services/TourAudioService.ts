/**
 * TourAudioService
 * Manages all tour-related audio playback across the application.
 * Centralizes audio functionality to avoid duplication and ensure single responsibility.
 */
import { AudioManager } from '@/core/ai/AudioManager';

export class TourAudioService {
  private static instance: TourAudioService;
  private audioManager: AudioManager;
  private lastPlayedStep: string | null = null;
  private isPlaying: boolean = false;
  private currentAudioFile: string | null = null;
  private isAssistantVisible: boolean = true; // Initially set to true

  private constructor() {
    this.audioManager = new AudioManager('/audio');
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): TourAudioService {
    if (!TourAudioService.instance) {
      TourAudioService.instance = new TourAudioService();
    }
    return TourAudioService.instance;
  }

  /**
   * Play audio for a tour step
   * @param stepId The ID of the current step
   * @param audioFile The audio file path to play
   * @param onComplete Optional callback when audio completes
   * @param force Force play even if the step has been played before
   */
  public playStepAudio(
    stepId: string, 
    audioFile: string, 
    onComplete?: () => void,
    force: boolean = false
  ): void {
    // Always stop current audio before playing new audio to prevent overlap
    this.stopAudio();
    
    // A small delay before starting new audio to ensure previous audio is fully stopped
    setTimeout(() => {
      // Don't play if the assistant is hidden
      if (!this.isAssistantVisible) {
        console.log(`Assistant is hidden, not playing audio for step ${stepId}`);
        if (onComplete) onComplete();
        return;
      }
      
      // Prevent duplicate audio if the same step tries to play multiple times (unless forced)
      if (!force && this.lastPlayedStep === stepId) {
        console.log(`Audio for step ${stepId} already played, skipping duplicate`);
        if (onComplete) onComplete();
        return;
      }

      console.log(`TourAudioService: Playing audio for step ${stepId}: ${audioFile}`);
      this.lastPlayedStep = stepId;
      this.currentAudioFile = audioFile;
      this.isPlaying = true;
      
      try {
        // Only dispatch event in browser environment, not in Jest tests
        if (typeof window !== 'undefined' && !(global as any).IS_JEST_TEST) {
          // Create a user interaction to help with autoplay
          const userInteraction = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          document.dispatchEvent(userInteraction);
        }
        
        this.audioManager.playAudio(audioFile, () => {
          console.log(`TourAudioService: Audio completed for step ${stepId}`);
          this.isPlaying = false;
          if (onComplete) onComplete();
        }, (error) => {
          console.warn(`TourAudioService: Error playing audio for step ${stepId}:`, error);
          // Consider the audio as played even if there was an error
          this.isPlaying = false;
          if (onComplete) onComplete();
        });
      } catch (error) {
        console.error(`TourAudioService: Exception playing audio:`, error);
        this.isPlaying = false;
        if (onComplete) onComplete();
      }
    }, 100); // Small delay to ensure previous audio is fully stopped
  }

  /**
   * Stop any currently playing audio
   */
  public stopAudio(): void {
    if (this.isPlaying) {
      console.log(`TourAudioService: Stopping audio playback`);
      this.audioManager.stopAudio();
      this.isPlaying = false;
    }
  }

  /**
   * Set mute state
   */
  public setMute(muted: boolean): void {
    this.audioManager.setMute(muted);
    if (muted) {
      this.isPlaying = false;
    }
  }

  /**
   * Set volume level
   */
  public setVolume(volume: number): void {
    this.audioManager.setVolume(volume);
  }

  /**
   * Reset the last played step tracking
   * Used when starting a new tour or reopening the assistant
   */
  public reset(): void {
    console.log('TourAudioService: Resetting audio state');
    this.lastPlayedStep = null;
    this.currentAudioFile = null;
    this.stopAudio();
    // Don't reset visibility here - it should be managed separately
  }
  
  /**
   * Set assistant visibility state
   * Used to prevent audio from playing when assistant is hidden
   */
  public setAssistantVisible(visible: boolean): void {
    console.log(`TourAudioService: Setting assistant visible = ${visible}`);
    this.isAssistantVisible = visible;
    
    // Stop audio if assistant is hidden
    if (!visible && this.isPlaying) {
      this.stopAudio();
    }
  }
  
  /**
   * Get current playing state
   */
  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
  
  /**
   * Get current audio file
   */
  public getCurrentAudioFile(): string | null {
    return this.currentAudioFile;
  }
  
  /**
   * Replay current audio
   */
  public replayCurrentAudio(onComplete?: () => void): void {
    if (this.currentAudioFile && this.lastPlayedStep) {
      this.playStepAudio(this.lastPlayedStep, this.currentAudioFile, onComplete, true);
    }
  }
}