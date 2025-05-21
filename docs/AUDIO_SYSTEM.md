# Premier Healthcare Audio System

This document provides a detailed overview of the Premier Healthcare Platform's audio system, specifically focusing on how audio is handled in tours and workflows.

## Table of Contents

1. [Overview](#overview)
2. [Audio Architecture](#audio-architecture)
3. [Key Components](#key-components)
4. [Audio Flow](#audio-flow)
5. [Preventing Audio Issues](#preventing-audio-issues)
6. [Debugging Audio Problems](#debugging-audio-problems)
7. [Extending the Audio System](#extending-the-audio-system)

## Overview

The Premier Healthcare Platform uses audio to enhance the guided tour experience. The audio system plays voice narration synchronized with tour steps, creating an engaging and accessible experience for users.

During our recent refactoring, we identified several issues with the audio system:
- Audio conflicts when multiple components tried to play audio simultaneously
- Duplicate audio when switching between steps
- No centralized control for audio playback
- Inconsistent audio behavior across different components

To address these issues, we implemented a new centralized audio architecture.

## Audio Architecture

The audio system follows a layered architecture:

1. **Core Layer**: `AudioManager.ts`
   - Low-level audio operations
   - Direct interaction with the Web Audio API
   - Basic audio controls (play, pause, stop)
   
2. **Service Layer**: `TourAudioService.ts`
   - Business logic for tour audio
   - Prevents duplicate audio playback
   - Tracks played audio steps
   - Provides a simplified API for components

3. **UI Layer**: Various components
   - Trigger audio playback via TourAudioService
   - No direct access to AudioManager
   - Focus on user interaction, not audio implementation

## Key Components

### AudioManager

Located at `src/core/ai/AudioManager.ts`

Responsibilities:
- Direct interaction with browser audio APIs
- Managing audio elements
- Handling autoplay restrictions
- Volume and mute controls
- Basic audio lifecycle (play, pause, resume, stop)

```typescript
// Example usage (internal to TourAudioService)
const audioManager = new AudioManager();
audioManager.playAudio("welcome/intro.mp3", onComplete);
audioManager.stopAudio();
```

### TourAudioService

Located at `src/services/TourAudioService.ts`

Responsibilities:
- Singleton service for centralized audio management
- Tracking which steps have played audio
- Preventing duplicate audio playback
- Delegating to AudioManager for actual playback
- Providing a clean API for components

```typescript
// Example usage (from components)
const audioService = TourAudioService.getInstance();
audioService.playStepAudio("step_id", "welcome/intro.mp3");
audioService.stopAudio();
```

## Audio Flow

When a tour step is displayed, the following occurs:

1. **TourManager** identifies the current step
2. **TourManager** requests audio playback via `TourAudioService`
3. **TourAudioService** checks if the step's audio has already been played
4. If not played, **TourAudioService** calls `AudioManager.playAudio()`
5. **AudioManager** creates or reuses an Audio element and plays the audio
6. On completion, callbacks are triggered to update state

### Sequence Diagram for Audio Playback

```
TourManager → TourAudioService: playStepAudio(stepId, audioFile)
TourAudioService → TourAudioService: check if already played
TourAudioService → AudioManager: playAudio(audioFile, onComplete)
AudioManager → Browser: new Audio(audioPath)
AudioManager → Browser: audio.play()
Browser → AudioManager: audio completed
AudioManager → TourAudioService: onComplete callback
TourAudioService → TourManager: update state
```

## Preventing Audio Issues

The refactored audio system prevents common issues:

### 1. Duplicate Audio

Previously, when navigating quickly between steps, multiple audio files could play simultaneously. The new system:
- Tracks which steps have played audio via `lastPlayedStep`
- Prevents the same step from playing audio multiple times
- Stops current audio before playing new audio

### 2. Race Conditions

When rapid navigation occurs:
- `stopAudio()` is called before new audio plays
- Completion callbacks are properly managed
- Timeouts prevent rapid changes from causing issues

### 3. Autoplay Restrictions

Modern browsers restrict autoplay. The system:
- Handles autoplay errors gracefully
- Treats prevented autoplay as "completed" to continue the flow
- Logs autoplay issues for debugging

## Debugging Audio Problems

For troubleshooting audio issues:

1. **Check Browser Console**:
   - Look for log messages from AudioManager or TourAudioService
   - Check for autoplay restriction messages
   - Verify audio file paths

2. **Check Audio Files**:
   - Ensure files exist at the expected paths
   - Verify audio format compatibility (MP3, WAV, etc.)
   - Check file permissions and CORS settings

3. **Common Issues and Solutions**:
   - **No audio plays**: Check browser autoplay policies or mute state
   - **Duplicate audio**: Possible issue with `lastPlayedStep` tracking
   - **Audio not stopping**: Check if `stopAudio()` is being called

## Extending the Audio System

### Adding New Audio Features

To add new audio capabilities:

1. **Extend TourAudioService First**:
   - Add methods to TourAudioService
   - Keep AudioManager focused on core audio operations

2. **Add Specific Service If Needed**:
   - For complex features, create a specialized service
   - Follow the same pattern as TourAudioService

### Example: Adding Background Music

```typescript
// In TourAudioService
private backgroundAudio: HTMLAudioElement | null = null;

public playBackgroundMusic(audioFile: string, volume: number = 0.3): void {
  if (this.backgroundAudio) {
    this.stopBackgroundMusic();
  }
  
  this.backgroundAudio = new Audio(`${window.location.origin}/audio/${audioFile}`);
  this.backgroundAudio.loop = true;
  this.backgroundAudio.volume = volume;
  this.backgroundAudio.play().catch(err => 
    console.error('Error playing background music:', err)
  );
}

public stopBackgroundMusic(): void {
  if (this.backgroundAudio) {
    this.backgroundAudio.pause();
    this.backgroundAudio = null;
  }
}
```

### Integrating with Animations

For synchronized audio-visual experiences:

1. Use the completion callbacks to trigger animations
2. Calculate animation timing based on audio duration
3. Consider using the Web Animation API for precise timing

```typescript
audioService.playStepAudio(stepId, audioFile, () => {
  // Trigger animation when audio completes
  startAnimation();
});
```