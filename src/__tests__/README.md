# Premier Healthcare Platform Tests

This directory contains tests for the Premier Healthcare Platform, focusing on ensuring the functionality works correctly across components and services.

## Test Structure

Tests are organized to reflect the application structure:

- `core/` - Tests for core functionality (AudioManager, etc.)
- `services/` - Tests for service layer (TourAudioService, etc.)

## Running Tests

You can run the tests using the following npm scripts:

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Testing Philosophy

These tests focus on:

1. **Unit tests** for individual components and services
2. **Integration tests** for interactions between components
3. **Mocking** of browser APIs and dependencies
4. **Comprehensive coverage** of edge cases

## Audio System Testing

The audio system has specific testing requirements as outlined in the documentation:

- Tests verify that audio starts and stops correctly
- Tests verify that audio doesn't play when components are hidden
- Tests check for proper cleanup to prevent audio leaks
- Tests ensure correct state management during rapid interactions

For more information, see the [Audio Interaction Testing](../../docs/AUDIO_INTERACTION_TESTING.md) documentation.

## Adding New Tests

When adding new tests:

1. Follow the existing patterns and organization
2. Use descriptive test and group names
3. Test edge cases, not just happy paths
4. Mock external dependencies for reliable tests