# Appointment Tour Management Guide

## Overview
The appointment booking tour is now fully configurable through a single file. You can easily update text, audio, reorder steps, or add/remove steps without touching any code.

## Configuration File Location
📁 `/src/config/appointmentTour.ts`

## How to Make Changes

### 1. Update Text Content
Edit the `text` field in any step:
```typescript
{
  id: "provider_selection",
  title: "Select a Provider",
  text: "Your new text content here...", // ← Edit this
  audioFile: "appointment-booking/step2_specialty_overview2.mp3"
}
```

### 2. Change Audio Files
Update the `audioFile` field:
```typescript
{
  id: "provider_selection",
  title: "Select a Provider", 
  text: "Select a Provider...",
  audioFile: "appointment-booking/new_audio_file.mp3" // ← Edit this
}
```

### 3. Reorder Steps
Simply cut and paste step objects in the desired order within the `steps` array.

### 4. Add New Steps
Copy this template and add it to the `steps` array:
```typescript
{
  id: "unique_step_id",
  title: "Step Title",
  text: "Step description text",
  audioFile: "appointment-booking/audio_file.mp3",
  triggerCondition: {
    schedulerStep: 'PROVIDER', // When this triggers
    action: 'provider_select'   // What action triggers it
  },
  nextStepId: "next_step_id" // What step comes after this
}
```

### 5. Remove Steps
Delete the entire step object from the `steps` array.

### 6. Change Step Flow
Update the `nextStepId` field to change which step comes next.

## Available Trigger Conditions

### Scheduler Steps:
- `'SPECIALTY'` - Specialty selection step
- `'PROVIDER'` - Provider selection step  
- `'DATETIME'` - Date/time selection step
- `'DETAILS'` - Appointment details step
- `'CONFIRMATION'` - Final confirmation step

### Actions:
- `'specialty_select'` - User selects a specialty
- `'provider_select'` - User selects a provider
- `'slot_select'` - User selects a time slot
- `'next_click'` - User clicks the Next button

## Current Tour Flow

1. **Provider Selection** → Triggers when user selects a provider
2. **Date & Time Selection** → Triggers when user selects a time slot
3. **Appointment Details** → Triggers when user clicks Next on details
4. **Visit Reason** → Triggers when user clicks Next on details
5. **Confirmation** → Final step

## Audio File Requirements

- Place audio files in `/public/audio/appointment-booking/`
- Use MP3 format
- Reference with relative path: `appointment-booking/filename.mp3`

## Validation

The system automatically validates your configuration:
- ✅ No duplicate step IDs
- ✅ Valid `nextStepId` references
- ✅ Required fields present
- ❌ Shows errors in console if invalid

## Testing Changes

1. Save the configuration file
2. Refresh the appointments page
3. Click the "Tour" button
4. Your changes will be applied immediately

## Example: Adding a New Step

```typescript
// Add this to the steps array in appointmentTour.ts
{
  id: "insurance_reminder",
  title: "Insurance Information",
  text: "Don't forget to bring your insurance card to your appointment!",
  audioFile: "appointment-booking/insurance_reminder.mp3",
  triggerCondition: {
    schedulerStep: 'CONFIRMATION',
    action: 'next_click'
  },
  nextStepId: "appointment_confirmed"
}
```

## Troubleshooting

### Tour not updating?
- Check browser console for validation errors
- Ensure file is saved properly
- Refresh the page

### Step not triggering?
- Verify `triggerCondition` matches the scheduler action
- Check that step ID is unique
- Ensure `nextStepId` references exist

### Audio not playing?
- Verify file exists in `/public/audio/appointment-booking/`
- Check file path format: `appointment-booking/filename.mp3`
- Ensure audio file is valid MP3

## Need Help?

The configuration file includes detailed comments and examples. If you need to make complex changes, refer to the inline documentation in `/src/config/appointmentTour.ts`.