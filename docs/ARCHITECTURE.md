# Premier Healthcare Platform Architecture

This document outlines the architecture of the Premier Healthcare Platform, focusing on the recent refactoring of key components to follow clean architecture principles.

## Table of Contents

1. [Overview](#overview)
2. [Workflow System](#workflow-system)
3. [Tour System](#tour-system)
4. [Audio Services](#audio-services)
5. [Best Practices](#best-practices)

## Overview

The Premier Healthcare Platform has been refactored to follow clean architecture principles, with a focus on:

- **Single Responsibility Principle (SRP)**: Each class and function has one responsibility.
- **Open/Closed Principle (OCP)**: Components are open for extension but closed for modification.
- **Dependency Inversion (DI)**: High-level modules depend on abstractions, not details.
- **Interface Segregation (ISP)**: Clients only depend on interfaces they use.

The refactoring targeted two major monolithic components:
1. The Workflow Engine
2. The AI Assistant Container

## Workflow System

### Before Refactoring

Previously, the workflow system was managed by a monolithic `WorkflowEngine` class with multiple responsibilities:
- Loading workflow definitions
- Tracking state
- Processing steps
- Executing actions
- Handling user choices
- Conditional logic

### After Refactoring

The workflow system has been restructured into a modular architecture:

```
src/core/ai/workflow/
├── index.ts                # Clean exports for the module
├── WorkflowEngine.ts       # Main orchestration component
├── WorkflowRegistry.ts     # Manages workflow definitions
├── WorkflowStateManager.ts # Handles state management
└── WorkflowActionHandler.ts # Processes workflow actions
```

#### WorkflowRegistry

Responsible for:
- Loading and storing workflow definitions
- Retrieving workflows and steps by ID
- Providing a directory of available workflows

```typescript
// Example usage
const registry = new WorkflowRegistry();
registry.registerWorkflows(workflows);
const workflow = registry.getWorkflow('quick_tour');
```

#### WorkflowStateManager

Responsible for:
- Managing the state object
- Tracking conversation history
- Handling audio status
- Managing UI state

```typescript
// Example usage
const stateManager = new WorkflowStateManager();
stateManager.resetForWorkflow('quick_tour', 'initial_step');
stateManager.updateStateFromStep(step);
```

#### WorkflowActionHandler

Responsible for:
- Executing workflow actions (navigate, form fill, etc.)
- Processing conditional logic
- Evaluating conditions

```typescript
// Example usage
const actionHandler = new WorkflowActionHandler();
const updatedState = actionHandler.executeActions(
  ['navigate:/appointments', 'fill:form1:name:value'],
  state
);
```

#### WorkflowEngine

Now acts as the orchestrator, delegating to specialized components:
- Uses WorkflowRegistry to access workflows
- Uses WorkflowStateManager to handle state
- Uses WorkflowActionHandler to execute actions

## Tour System

### Before Refactoring

Previously, the AI Assistant Container was a monolithic component handling:
- Tour state management
- Tour navigation
- Audio playback
- View rendering for all types
- Tour configuration loading
- Debug functionality

### After Refactoring

The tour system has been restructured into focused components:

```
src/ui/components/ai-assistant/
├── AIAssistantContainer.tsx  # Main container (simplified)
├── TourView.tsx              # Tour view component
└── tour/
    ├── index.ts               # Clean exports
    ├── TourManager.ts         # Tour state and flow
    ├── ViewRenderer.tsx       # Renders appropriate views
    ├── TourConfigProvider.ts  # Handles tour configuration
    ├── TourCompleteView.tsx   # Tour completion UI
    └── DebugPanel.tsx         # Debug functionality
```

#### TourManager (Hook)

Responsible for:
- Managing tour state
- Handling tour initialization
- Processing step changes
- Audio coordination

```typescript
// Example usage
const {
  tourState,
  handleTourStepChange,
  handleTourCompleteAction,
  handleCloseTour,
} = useTourManager({
  currentWorkflowStep,
  tourSteps,
  onHideAssistant,
  onSelectChoice,
});
```

#### ViewRenderer

Responsible for:
- Rendering different view types (popup, celebration, etc.)
- Selecting the appropriate component based on display type

```typescript
// Example usage
<ViewRenderer
  currentStep={currentStep}
  onChoiceSelected={selectChoice}
  onClose={hideAssistant}
/>
```

#### TourConfigProvider (Hook)

Responsible for:
- Loading tour configuration from YAML
- Providing fallback steps if needed
- Handling loading states and errors

```typescript
// Example usage
const { tourSteps, loading, error } = useTourConfigProvider('quick_tour');
```

#### TourCompleteView

Responsible for:
- Rendering the tour completion celebration
- Managing the confetti effect
- Handling completion actions

```typescript
// Example usage
<TourCompleteView onClose={handleTourCompleteClose} />
```

## Audio Services

The audio system has been centralized through a TourAudioService:

```
src/services/
└── TourAudioService.ts      # Centralized audio management
```

### TourAudioService

Responsible for:
- Managing audio playback
- Preventing duplicate audio
- Tracking played audio steps
- Controlling volume and mute settings

```typescript
// Example usage
const audioService = TourAudioService.getInstance();
audioService.playStepAudio('step_id', 'audio/file.mp3', onCompleteCallback);
audioService.stopAudio();
```

## Best Practices

### Singleton Pattern

Used for services that need a single instance:
- TourAudioService
- TourInteractionManager

```typescript
public static getInstance(): TourAudioService {
  if (!TourAudioService.instance) {
    TourAudioService.instance = new TourAudioService();
  }
  return TourAudioService.instance;
}
```

### React Hooks

Custom hooks created for reusable logic:
- useTourManager
- useTourConfigProvider

```typescript
// Example of a custom hook
export const useTourConfigProvider = (tourId: string): TourConfigResult => {
  // Implementation...
  return { tourSteps, loading, error };
};
```

### Component Structure

Components follow a consistent pattern:
- Clear interface definitions
- Focused responsibilities
- Proper prop handling
- Clean rendering logic

### Code Organization

Code is organized by feature and responsibility:
- Core domain logic in `/core`
- UI components in `/ui/components`
- Services in `/services`
- Reusable hooks in appropriate locations

## Benefits of the New Architecture

1. **Improved Maintainability**
   - Smaller, more focused files
   - Clear separation of concerns
   - Easier to understand each component's purpose

2. **Better Testability**
   - Components can be tested in isolation
   - Dependencies can be mocked easily
   - Each component has a clear interface

3. **Enhanced Scalability**
   - New features can be added by extending existing components
   - Changes in one area don't ripple through the system
   - Additional workflow types or tour steps can be added with minimal changes

4. **Developer Experience**
   - Easier onboarding for new developers
   - Improved code navigation
   - Clearer understanding of system components