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
   */
  public playStepAudio(stepId: string, audioFile: string, onComplete?: () => void): void {
    // Prevent duplicate audio if the same step tries to play multiple times
    if (this.lastPlayedStep === stepId) {
      console.log(`Audio for step ${stepId} already played, skipping duplicate`);
      if (onComplete) onComplete();
      return;
    }

    console.log(`TourAudioService: Playing audio for step ${stepId}: ${audioFile}`);
    this.lastPlayedStep = stepId;
    
    this.audioManager.playAudio(audioFile, () => {
      console.log(`TourAudioService: Audio completed for step ${stepId}`);
      if (onComplete) onComplete();
    });
  }

  /**
   * Stop any currently playing audio
   */
  public stopAudio(): void {
    this.audioManager.stopAudio();
  }

  /**
   * Set mute state
   */
  public setMute(muted: boolean): void {
    this.audioManager.setMute(muted);
  }

  /**
   * Set volume level
   */
  public setVolume(volume: number): void {
    this.audioManager.setVolume(volume);
  }

  /**
   * Reset the last played step tracking
   * Used when starting a new tour
   */
  public reset(): void {
    this.lastPlayedStep = null;
    this.audioManager.stopAudio();
  }
}