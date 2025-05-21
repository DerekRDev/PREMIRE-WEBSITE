/**
 * Jest setup file for Premier Healthcare Platform tests
 */

// Import testing library extensions
require('@testing-library/jest-dom');

// Set up fake timers for all tests
jest.useFakeTimers();

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  // Keep error and warn but make log silent during tests
  log: jest.fn(),
  // You can also silence these if needed
  // error: jest.fn(),
  // warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};