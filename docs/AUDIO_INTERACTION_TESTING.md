# Audio Interaction Testing Guide

This document outlines the expected behavior for audio interactions with the AI Assistant and provides a testing checklist to ensure consistent behavior.

## User Interaction Scenarios

### 1. Opening and Closing the AI Assistant
- **Opening the assistant**: 
  - User clicks "Need Help" button
  - Assistant should appear with welcome message
  - Welcome audio should play automatically
  - UI should show speaking indicator

- **Closing the assistant**:
  - User clicks "Close" button
  - Audio should immediately stop
  - Assistant should disappear
  - When reopened, assistant should start from welcome step with fresh audio

- **Clicking "Maybe later"**:
  - Audio should immediately stop
  - Assistant should disappear

### 2. Tour Navigation Interactions
- **Starting the tour**:
  - User clicks "Take a quick tour"
  - Introduction audio should play
  - When user clicks "Continue", audio should stop before moving to next step
  - Next step audio should start playing

- **Navigating through tour steps**:
  - User clicks "Next" button
  - Current step audio should stop
  - Next step should appear
  - Next step audio should start playing
  - No audio overlap between steps

- **Navigating backward in tour**:
  - User clicks "Previous" button
  - Current audio should stop
  - Previous step should appear
  - Previous step audio should play

- **Exiting tour manually**:
  - User clicks "Exit Tour" button
  - Tour audio should stop immediately
  - Tour UI should close
  - No audio should continue playing

### 3. Assistant Button Interactions
- **Multiple clicks on assistant button**:
  - If assistant is visible and audio is playing:
    - First click should have no effect
  - If assistant is not visible:
    - Audio should start fresh

- **Rapid navigation**:
  - Rapidly clicking through "Next" buttons
  - Previous audio should stop before new audio starts
  - No audio should overlap
  - No audio should continue after tour ends

### 4. Browser Navigation Interactions
- **Navigating away from page**:
  - User navigates to a different page in the app
  - Audio should stop
  - Assistant state should be preserved if within the same flow

- **Refreshing the page**:
  - Audio should stop
  - Assistant should reset to initial state

## Audio Behaviors to Test

1. **Audio Start**:
   - Audio should start playing automatically at the beginning of each step
   - Audio should play from beginning (not resume from previous point)

2. **Audio Stop**:
   - Audio should stop immediately when:
     - "Close" is clicked
     - "Exit Tour" is clicked
     - "Maybe later" is clicked
     - Any navigation button is clicked (before new audio starts)
     - Tour is completed

3. **Audio Transitions**:
   - No audio overlap between steps
   - Clean cut between audio files
   - No "orphaned" audio continuing to play after UI changes

## Testing Workflow

1. Test each scenario individually
2. Test rapid interactions (clicking quickly through tour)
3. Test edge cases (double-clicking, clicking during audio transitions)
4. Test on different browsers
5. Test on mobile devices

## Potential Issues to Watch For

1. **Audio Leaks**: Audio continues playing after UI is closed
2. **Duplicate Audio**: Multiple audio files playing simultaneously
3. **Missing Audio**: Steps where audio should play but doesn't
4. **Delayed Audio**: Audio that starts playing too late
5. **Browser Autoplay Limitations**: Some browsers block autoplay
6. **Mobile-Specific Issues**: Different behavior on touch devices