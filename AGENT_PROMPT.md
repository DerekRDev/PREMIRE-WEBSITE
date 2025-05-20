# AI Patient Assistant Agent System Prompt

## Overview

You are tasked with designing a guided patient experience system for Premier Healthcare Platform. This involves creating an intelligent assistant that proactively guides patients through healthcare workflows using voice prompts, interactive UI elements, and automated actions. The system uses pre-recorded audio paired with visual components to create a seamless, guided experience without requiring complex real-time AI processing.

## Core Architecture

### 1. Workflow-Based System

The assistant operates using structured JSON workflow definitions that describe:
- Sequential steps in a patient journey
- Decision points and user choices
- Pre-recorded audio prompts
- UI display modes
- Automated actions (form filling, navigation)
- Transition logic between steps

Example workflow structure:
```json
{
  "id": "appointment_booking",
  "name": "Book an Appointment",
  "initialStep": "welcome",
  "steps": [
    {
      "id": "welcome",
      "displayType": "popup",
      "text": "Welcome! I'll help you book your appointment. What type of appointment do you need?",
      "audioFile": "appointment/welcome.mp3",
      "choices": [
        {
          "id": "new_patient",
          "text": "New Patient Visit",
          "iconUrl": "svg:<svg>...</svg>",
          "nextStepId": "select_specialty"
        },
        {
          "id": "follow_up",
          "text": "Follow-up Visit",
          "iconUrl": "svg:<svg>...</svg>",
          "nextStepId": "select_provider" 
        }
      ],
      "actions": {
        "beforeStep": ["navigate:/appointments/new"]
      }
    },
    // More steps...
  ]
}
```

### 2. State Management

The assistant maintains state that includes:
- Current workflow and step
- Conversation history
- Collected user information
- Audio playback status
- UI display state

### 3. Audio System

- Pre-recorded MP3 files for all voice prompts
- Organized by workflow and step
- Professional voice talent recordings
- Support for playback control (pause, resume, disable)

### 4. UI Components

- Floating assistant button (always accessible)
- Modal popup messages with voice synchronization
- Choice selector cards with icons and descriptions
- Visual effects for celebrations (confetti, animations)
- Progress indicators for multi-step flows

## Patient Workflows

Implement these core workflows:

### 1. Welcome/Introduction Flow
- Triggered: On first visit or manual activation
- Purpose: Orient new patients to the platform
- Key steps:
  - Welcome greeting
  - Explanation of available services
  - Quick tour offer
  - Account creation guidance

### 2. Appointment Booking Flow
- Triggered: When navigating to appointments or clicking "Book Appointment"
- Purpose: Guide through appointment scheduling process
- Key steps:
  - Appointment type selection
  - Specialty/provider selection
  - Date/time selection
  - Confirmation and follow-up instructions

### 3. Payment Assistance Flow
- Triggered: On payment pages or billing questions
- Purpose: Help patients understand and complete payments
- Key steps:
  - Payment method selection guidance
  - Insurance vs. self-pay explanation
  - Financial assistance options
  - Payment confirmation and receipt options

### 4. Insurance Verification Flow
- Triggered: When adding/updating insurance
- Purpose: Guide insurance information collection
- Key steps:
  - Insurance card scanning guidance
  - Manual information entry help
  - Verification process explanation
  - Coverage information review

### 5. Confirmation/Success Flows
- Triggered: After completing major actions
- Purpose: Celebrate completion, provide next steps
- Key features:
  - Confetti or visual celebrations
  - Clear confirmation messages
  - Follow-up instructions
  - Related action suggestions

## Implementation Details

### 1. Action Types

The assistant can perform these actions:
- **Navigation**: Direct users to specific pages
  - Format: `navigate:/path/to/page`
- **Form filling**: Complete form fields automatically
  - Format: `fill:formId:fieldId:value`
- **UI interaction**: Click buttons, open modals
  - Format: `interact:elementId:action`
- **Conditional logic**: Branch based on user context
  - Format: `condition:check:thenAction:elseAction`

### 2. Trigger Mechanisms

The assistant can be triggered by:
- **Page navigation**: Specific URLs trigger relevant workflows
- **User events**: Clicking elements, completing forms
- **Timing**: Hesitation on forms, time on page thresholds
- **Manual activation**: Clicking the assistant button
- **Contextual needs**: Error states, complex UI elements

### 3. Audio-Visual Synchronization

- Voice prompts play automatically for each step
- UI elements appear synchronized with audio
- Visual cues indicate speaking state
- Options appear after voice prompt completes

### 4. Personalization

- Use patient name when available
- Reference previous actions and choices
- Adapt to patient history and preferences
- Modify tone based on context (urgent vs. routine)

## Technical Implementation

Create these core components:

1. **WorkflowEngine**: Central logic for processing workflows
   - Loads workflow definitions
   - Tracks current state
   - Processes steps and choices
   - Executes actions
   - Manages audio playback

2. **AIAssistantProvider**: React context provider
   - Exposes assistant state and methods
   - Handles initialization and cleanup
   - Connects to workflow engine
   - Provides hooks for components

3. **Assistant UI Components**:
   - Main container component
   - Popup message component
   - Choice selector component
   - Visual effects component
   - Audio player component

4. **Workflow Definitions**:
   - JSON files defining all steps and logic
   - Organized by patient journey type
   - Include all text, choices, and actions
   - Reference audio file paths

## Design Principles

1. **Accessible and inclusive**:
   - Voice and visual options for all content
   - Clear language at 6th-8th grade reading level
   - Support for users with disabilities
   - Multiple input methods (touch, keyboard, voice)

2. **Non-intrusive but helpful**:
   - Proactive assistance without disruption
   - Easy to dismiss or disable
   - Context-aware appearance
   - Value-adding at each interaction

3. **Human-centered design**:
   - Warm, empathetic language
   - Patience with complex processes
   - Celebration of progress
   - Acknowledgment of healthcare anxiety

4. **Efficiency-focused**:
   - Reduce clicks and form filling
   - Anticipate common questions
   - Provide shortcuts when possible
   - Remember previous choices

## Development Approach

1. Start with core infrastructure:
   - Workflow engine
   - Basic UI components
   - Audio playback system
   - State management

2. Create sample workflows with placeholder audio:
   - Complete appointment booking flow
   - Simple payment flow
   - Basic welcome flow

3. Develop and test UI components:
   - Assistant button
   - Popup messages
   - Choice selectors
   - Visual effects

4. Record professional audio:
   - Script all prompts
   - Record with consistent voice talent
   - Edit and optimize audio files
   - Implement audio-visual synchronization

5. Implement analytics to track:
   - Workflow completion rates
   - Step abandonment points
   - Most helpful assistant features
   - User satisfaction metrics

## Performance Considerations

1. **Audio optimization**:
   - Compress audio files appropriately
   - Preload audio for upcoming steps
   - Support progressive loading
   - Fallback for audio playback issues

2. **Responsive design**:
   - Adapt to all device sizes
   - Consider mobile bandwidth limitations
   - Touch-friendly interface elements
   - Landscape/portrait adaptability

3. **Accessibility**:
   - WCAG 2.1 AA compliance
   - Screen reader compatibility
   - Keyboard navigation support
   - Color contrast requirements

## Success Criteria

The AI Patient Assistant should achieve:

1. **Increased form completion rates** by 30%+
2. **Reduced support calls** related to navigation by 25%+
3. **Improved patient satisfaction scores** by 20%+
4. **Faster completion times** for common tasks by 40%+
5. **Higher engagement** with preventative care options by 15%+

Your task is to design and implement this comprehensive AI Patient Assistant system for Premier Healthcare, focusing on creating intuitive, guided experiences that make healthcare interactions simpler and more accessible for all patients.