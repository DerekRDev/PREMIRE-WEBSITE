# Testing Strategy for Premier Healthcare Platform

This document outlines the testing approach for the Premier Healthcare Platform, with a particular focus on audio interaction testing.

## Testing Levels

### 1. Unit Tests

Unit tests focus on the smallest units of code, typically individual functions or classes. For the audio system, this includes testing:

- **AudioManager**: Core functionality for playing, pausing, stopping, and managing audio
- **TourAudioService**: Business logic for tour-specific audio handling

### 2. Integration Tests

Integration tests verify that different parts of the system work together correctly. For the audio system, this includes:

- **TourAudioIntegration**: Complete tour flows with audio transitions
- **AudioManagerIntegration**: Browser API interaction (mocked)

### 3. Manual Testing

While automated tests are valuable, some aspects require manual testing, especially for audio:

- Real browser autoplay policy testing
- Actual audio playback synchronization
- Mobile device testing
- Cross-browser compatibility
- Verifying audio quality and transitions

## Testing Approach

### For Audio Functionality

1. **Mock Browser APIs**: We mock the Audio API, AudioContext, and DOM events to allow testing without an actual browser.

2. **Test State Transitions**: Verify that state changes correctly during audio playback, stopping, and transitions.

3. **Test Edge Cases**: 
   - User quickly navigating through steps
   - Assistant becoming hidden during playback
   - Audio errors and recovery
   - Multiple rapid interactions
   - Mobile-specific behaviors

4. **Isolation**: Each test should run in isolation with a clean state to prevent test interdependence.

## Test Structure

Tests are organized as follows:

```
src/__tests__/              # Root test directory
├── core/                   # Tests for core functionality
│   └── AudioManager.test.ts
├── services/               # Tests for service layer
│   └── TourAudioService.test.ts
├── integration/            # Tests for component interactions
│   └── TourAudioIntegration.test.ts
└── README.md               # Testing documentation
```

## Running Tests

Tests can be run with the following commands:

```bash
# Install dependencies (including Jest)
npm install

# Run all tests
npm test

# Run specific tests
npm test -- -t "AudioManager"

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Testing Guidelines

1. **Test Behavior, Not Implementation**: Focus on testing what the code does, not how it does it.

2. **Cover Edge Cases**: Especially important for audio, where timing and browser behavior can be unpredictable.

3. **Use Descriptive Test Names**: Tests should clearly state what they're testing and expected outcomes.

4. **Mock External Dependencies**: Audio APIs, timers, and browser features should be mocked.

5. **Clean Up After Tests**: Each test should start with a clean state.

## Audio-Specific Testing

For audio functionality, focus on these key aspects:

1. **Playback Control**: Verify audio starts and stops correctly.

2. **Error Handling**: Test behavior when audio fails to play.

3. **Transitions**: Verify clean transitions between audio steps.

4. **User Interactions**: Test how audio responds to user actions (closing, navigating, etc.).

5. **Visibility Effects**: Test that audio stops when components are hidden.

See [AUDIO_INTERACTION_TESTING.md](./AUDIO_INTERACTION_TESTING.md) for specific testing scenarios.

## Coverage Goals

Aim for the following coverage levels:

- Core audio functionality: 90%+ coverage
- Service layer: 85%+ coverage
- Integration scenarios: Cover all main user flows

The most critical paths to test are:
- Complete tour flow with audio
- Tour interruptions and navigation
- Error recovery
- Assistant visibility changes