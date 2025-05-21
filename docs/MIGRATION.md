# Premier Healthcare Migration Guide

This document outlines the migration plans for deprecated components in the Premier Healthcare Platform.

## Workflow System Migration

### Current Status

We've refactored the workflow system from a monolithic implementation to a modular architecture:

- **Old location**: `/src/services/workflow/WorkflowEngine.ts`
- **New location**: `/src/core/ai/workflow/*` (multiple specialized components)

### Migration Plan

We've implemented a backward compatibility layer to ensure a smooth transition:

1. The old `WorkflowEngine.ts` file now:
   - Contains deprecation notices
   - Extends the new implementation
   - Logs warning messages when used
   - Points developers to the new location

### Recommended Developer Actions

If you're using the old WorkflowEngine:

```typescript
// Old import (deprecated)
import { WorkflowEngine } from '@/services/workflow/WorkflowEngine';

// Replace with new import
import { WorkflowEngine } from '@/core/ai/workflow';
```

For advanced usage, use the specialized components:

```typescript
import { 
  WorkflowEngine,
  WorkflowRegistry,
  WorkflowStateManager,
  WorkflowActionHandler
} from '@/core/ai/workflow';
```

### Timeline

1. **Phase 1** (Current): Backward compatibility with warnings
   - Keep deprecated files with warnings
   - Update documentation
   - Encourage developers to use new implementation

2. **Phase 2** (Next sprint): Audit usage and update
   - Audit codebase for any remaining usage of deprecated components
   - Update any instances found
   - Add tests to ensure functionality remains the same

3. **Phase 3** (Future): Remove deprecated files
   - Once we're confident no code depends on the old locations
   - Remove deprecated files
   - Update build checks to catch any missed imports

## AIAssistantContainer Refactoring

The AIAssistantContainer has been refactored into multiple specialized components:

- **Old**: Large monolithic component
- **New**: Multiple focused components in `/src/ui/components/ai-assistant/tour/*`

No compatibility layer was needed as this was a direct replacement within a single file.

## Additional Resources

For more information, see:
- [ARCHITECTURE.md](./ARCHITECTURE.md): Overall system architecture
- [REFACTORING.md](./REFACTORING.md): Details of the refactoring changes
- [AUDIO_SYSTEM.md](./AUDIO_SYSTEM.md): Audio system documentation