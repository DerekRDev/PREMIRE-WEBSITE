# Complete Premier Healthcare Platform Project Directory Structure

Here's the comprehensive directory structure for building a complete custom solution from the start:

```
premier-hc-platform/
├── .github/                           # CI/CD workflows
├── .vscode/                           # Editor settings
├── public/                            # Static assets
│   ├── favicon.ico
│   ├── logo.svg
│   ├── images/
│   ├── audio/                         # Audio files for AI assistant
│   │   ├── introduction/              # Introductory voice prompts
│   │   ├── appointment/               # Appointment booking voice prompts
│   │   ├── payments/                  # Payment process voice prompts
│   │   ├── insurance/                 # Insurance workflow voice prompts
│   │   └── confirmations/             # Success message voice prompts
│   └── locales/                       # Internationalization files
├── src/
│   ├── core/                          # Domain layer (business rules)
│   │   ├── entities/                  # Business objects
│   │   │   ├── Patient.ts
│   │   │   ├── Appointment.ts
│   │   │   ├── Provider.ts
│   │   │   ├── Referral.ts
│   │   │   ├── PatientIntake.ts
│   │   │   ├── InsuranceInfo.ts
│   │   │   ├── MedicalHistory.ts
│   │   │   ├── ConsentForm.ts
│   │   │   ├── Payment.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── usecases/                  # Business logic
│   │   │   ├── appointment/
│   │   │   │   ├── FindAvailableSlots.ts
│   │   │   │   ├── ScheduleAppointment.ts
│   │   │   │   ├── RescheduleAppointment.ts
│   │   │   │   └── CancelAppointment.ts
│   │   │   │
│   │   │   ├── intake/
│   │   │   │   ├── StartPatientIntake.ts
│   │   │   │   ├── CompleteIntakeForm.ts
│   │   │   │   ├── VerifyInsurance.ts
│   │   │   │   ├── ProcessConsent.ts
│   │   │   │   └── ProcessPayment.ts
│   │   │   │
│   │   │   ├── referral/
│   │   │   │   ├── CreateReferral.ts
│   │   │   │   ├── TrackReferral.ts
│   │   │   │   └── CompleteReferral.ts
│   │   │   │
│   │   │   ├── patient/
│   │   │   │   ├── RegisterPatient.ts
│   │   │   │   ├── UpdatePatientInfo.ts
│   │   │   │   └── PatientPortalAccess.ts
│   │   │   │
│   │   │   └── analytics/
│   │   │       ├── TrackEngagement.ts
│   │   │       ├── MeasureROI.ts
│   │   │       └── GenerateReports.ts
│   │   │
│   │   ├── interfaces/                # Abstract interfaces
│   │   │   ├── repositories/
│   │   │   │   ├── PatientRepository.ts
│   │   │   │   ├── AppointmentRepository.ts
│   │   │   │   ├── ReferralRepository.ts
│   │   │   │   └── IntakeRepository.ts
│   │   │   │
│   │   │   └── services/
│   │   │       ├── EHRService.ts
│   │   │       ├── PaymentService.ts
│   │   │       ├── InsuranceVerificationService.ts
│   │   │       ├── NotificationService.ts
│   │   │       └── AnalyticsService.ts
│   │   │
│   │   ├── ai/                        # AI Assistant infrastructure
│   │   │   ├── AIAssistantTypes.ts
│   │   │   ├── WorkflowEngine.ts
│   │   │   ├── workflows/             # Workflow definitions
│   │   │   │   ├── welcome.json       # Welcome/Intro flow
│   │   │   │   ├── appointment.json   # Appointment booking flow
│   │   │   │   ├── payment.json       # Payment assistance flow
│   │   │   │   ├── insurance.json     # Insurance help flow
│   │   │   │   └── common.json        # Shared workflow elements
│   │   │   │
│   │   │   ├── actions/               # Assistant action handlers
│   │   │   │   ├── navigation.ts      # Navigation actions
│   │   │   │   ├── forms.ts           # Form filling actions
│   │   │   │   ├── appointments.ts    # Appointment actions
│   │   │   │   └── info.ts            # Information retrieval actions
│   │   │   │
│   │   │   └── analytics/             # Assistant usage analytics
│   │   │       ├── TrackAssistantUsage.ts
│   │   │       └── MeasureAssistantEffectiveness.ts
│   │   │
│   │   └── multi-tenant/              # Multi-tenant support
│   │       ├── TenantManager.ts
│   │       ├── TenantConfig.ts
│   │       └── FeatureFlags.ts
│   │
│   ├── infrastructure/                # Data & external services
│   │   ├── api/
│   │   │   ├── epic/
│   │   │   │   ├── EpicApiClient.ts
│   │   │   │   ├── config.ts
│   │   │   │   ├── fhir/
│   │   │   │   │   ├── FhirClient.ts
│   │   │   │   │   ├── resources/
│   │   │   │   │   │   ├── Patient.ts
│   │   │   │   │   │   ├── Appointment.ts
│   │   │   │   │   │   ├── Slot.ts
│   │   │   │   │   │   ├── Coverage.ts
│   │   │   │   │   │   ├── Consent.ts
│   │   │   │   │   │   └── Questionnaire.ts
│   │   │   │   │   │
│   │   │   │   │   └── intakes/
│   │   │   │   │       ├── PatientIntakeClient.ts
│   │   │   │   │       └── FhirMappers.ts
│   │   │   │   │
│   │   │   │   └── smart/
│   │   │   │       ├── SmartAuthClient.ts
│   │   │   │       └── SmartLaunchHandler.ts
│   │   │   │
│   │   │   ├── payment/
│   │   │   │   ├── StripeClient.ts
│   │   │   │   └── PaymentProcessor.ts
│   │   │   │
│   │   │   ├── insurance/
│   │   │   │   ├── RealTimeEligibility.ts
│   │   │   │   └── InsuranceVerifier.ts
│   │   │   │
│   │   │   └── notifications/
│   │   │       ├── EmailService.ts
│   │   │       ├── SMSService.ts
│   │   │       └── PushNotificationService.ts
│   │   │
│   │   ├── persistence/
│   │   │   ├── repositories/
│   │   │   │   ├── PatientRepository.ts
│   │   │   │   ├── AppointmentRepository.ts
│   │   │   │   ├── ReferralRepository.ts
│   │   │   │   └── IntakeRepository.ts
│   │   │   │
│   │   │   ├── models/                # Database models
│   │   │   │   ├── PatientModel.ts
│   │   │   │   ├── AppointmentModel.ts
│   │   │   │   ├── ReferralModel.ts
│   │   │   │   └── IntakeModel.ts
│   │   │   │
│   │   │   └── migrations/            # Database migrations
│   │   │
│   │   └── services/
│   │       ├── analytics/
│   │       │   ├── AnalyticsClient.ts
│   │       │   └── EventTracking.ts
│   │       │
│   │       ├── audio/                 # Audio services
│   │       │   ├── AudioPlayer.ts
│   │       │   └── AudioManager.ts
│   │       │
│   │       └── storage/
│   │           ├── S3Client.ts
│   │           └── DocumentStorage.ts
│   │
│   ├── adapters/                      # Adapter layer
│   │   ├── controllers/
│   │   │   ├── api/                   # NextJS API routes
│   │   │   │   ├── appointments/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── [id].ts
│   │   │   │   │   └── available.ts
│   │   │   │   │
│   │   │   │   ├── intake/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── [id].ts
│   │   │   │   │   ├── insurance-verify.ts
│   │   │   │   │   └── payment.ts
│   │   │   │   │
│   │   │   │   ├── referrals/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── [id].ts
│   │   │   │   │
│   │   │   │   ├── ai-assistant/      # AI Assistant API routes
│   │   │   │   │   ├── workflow.ts    # Workflow management
│   │   │   │   │   ├── audio.ts       # Audio file serving
│   │   │   │   │   └── analytics.ts   # Usage tracking
│   │   │   │   │
│   │   │   │   └── analytics/
│   │   │   │       ├── track-event.ts
│   │   │   │       └── reports.ts
│   │   │   │
│   │   │   └── webhooks/
│   │   │       ├── epic.ts
│   │   │       ├── payment.ts
│   │   │       └── insurance.ts
│   │   │
│   │   ├── presenters/
│   │   │   ├── appointment/
│   │   │   ├── intake/
│   │   │   └── referral/
│   │   │
│   │   └── gateways/
│   │       ├── EpicFhirGateway.ts
│   │       ├── PaymentGateway.ts
│   │       └── AnalyticsGateway.ts
│   │
│   ├── ui/                           # Framework layer (NextJS)
│   │   ├── design-system/            # Shared UI components
│   │   │   ├── tokens/               # Design tokens
│   │   │   │   ├── colors.ts
│   │   │   │   ├── spacing.ts
│   │   │   │   ├── typography.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── components/           # Base UI components
│   │   │   │   ├── Button/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Button.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── Card/
│   │   │   │   ├── Input/
│   │   │   │   ├── Select/
│   │   │   │   ├── DatePicker/
│   │   │   │   ├── Calendar/
│   │   │   │   ├── Stepper/
│   │   │   │   ├── Modal/
│   │   │   │   ├── Tabs/
│   │   │   │   ├── DataTable/
│   │   │   │   ├── Badge/
│   │   │   │   ├── Charts/
│   │   │   │   ├── Skeleton/
│   │   │   │   ├── Toast/
│   │   │   │   └── Icon/
│   │   │   │
│   │   │   └── theme.ts             # Theme configuration
│   │   │
│   │   ├── components/              # Business components
│   │   │   ├── common/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── MobileNavigation.tsx
│   │   │   │   ├── DesktopNavigation.tsx
│   │   │   │   ├── OptimizedImage.tsx
│   │   │   │   └── SEO.tsx
│   │   │   │
│   │   │   ├── ai-assistant/        # AI Assistant UI components
│   │   │   │   ├── Assistant.tsx    # Main assistant container
│   │   │   │   ├── PopupMessage.tsx # Message popup component
│   │   │   │   ├── ChoiceSelector.tsx # Choice selection UI
│   │   │   │   ├── AudioPlayer.tsx  # Audio playback component
│   │   │   │   ├── AssistantAvatar.tsx # Assistant visual character
│   │   │   │   ├── VisualEffects.tsx # Confetti and animations
│   │   │   │   ├── ProgressIndicator.tsx # Progress tracking
│   │   │   │   └── index.ts         # Component exports
│   │   │   │
│   │   │   ├── scheduling/
│   │   │   │   ├── AppointmentScheduler.tsx
│   │   │   │   ├── SpecialtySelection.tsx
│   │   │   │   ├── ProviderSearch.tsx
│   │   │   │   ├── ProviderCard.tsx
│   │   │   │   ├── DateTimeSelection.tsx
│   │   │   │   ├── TimeSlotGrid.tsx
│   │   │   │   └── AppointmentConfirmation.tsx
│   │   │   │
│   │   │   ├── intake/
│   │   │   │   ├── IntakeFlow.tsx
│   │   │   │   ├── DemographicsForm.tsx
│   │   │   │   ├── InsuranceVerification.tsx
│   │   │   │   ├── InsuranceCardScanner.tsx
│   │   │   │   ├── MedicalHistoryForm.tsx
│   │   │   │   ├── ConsentForms.tsx
│   │   │   │   ├── PaymentProcessor.tsx
│   │   │   │   └── IntakeConfirmation.tsx
│   │   │   │
│   │   │   ├── patient/
│   │   │   │   ├── PatientDashboard.tsx
│   │   │   │   ├── PatientProfile.tsx
│   │   │   │   ├── MedicalHistory.tsx
│   │   │   │   ├── UpcomingAppointments.tsx
│   │   │   │   └── PatientMessages.tsx
│   │   │   │
│   │   │   ├── referral/
│   │   │   │   ├── ReferralDashboard.tsx
│   │   │   │   ├── ReferralForm.tsx
│   │   │   │   ├── ReferralStatus.tsx
│   │   │   │   └── ReferralDetails.tsx
│   │   │   │
│   │   │   └── analytics/
│   │   │       ├── ROIDashboard.tsx
│   │   │       ├── CallCenterMetrics.tsx
│   │   │       ├── AppointmentAnalytics.tsx
│   │   │       └── ReferralMetrics.tsx
│   │   │
│   │   ├── hooks/                    # React hooks
│   │   │   ├── useAppointments.ts
│   │   │   ├── useProviders.ts
│   │   │   ├── useIntakeForm.ts
│   │   │   ├── useReferrals.ts
│   │   │   ├── usePatient.ts
│   │   │   ├── useAnalytics.ts
│   │   │   ├── useAccessibility.ts
│   │   │   ├── useAIAssistant.ts     # AI Assistant hook
│   │   │   └── useAudioPlayer.ts     # Audio playback hook
│   │   │
│   │   ├── pages/                    # Next.js pages
│   │   │   ├── _app.tsx
│   │   │   ├── _document.tsx
│   │   │   ├── index.tsx             # Homepage
│   │   │   │
│   │   │   ├── api/                  # API routes
│   │   │   │
│   │   │   ├── appointments/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── new.tsx
│   │   │   │   └── [id].tsx
│   │   │   │
│   │   │   ├── intake/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── [id].tsx
│   │   │   │   └── confirmation.tsx
│   │   │   │
│   │   │   ├── patient/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── profile.tsx
│   │   │   │   ├── appointments.tsx
│   │   │   │   ├── messages.tsx
│   │   │   │   └── medical-records.tsx
│   │   │   │
│   │   │   ├── referrals/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── new.tsx
│   │   │   │   └── [id].tsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── index.tsx
│   │   │       ├── patients.tsx
│   │   │       ├── appointments.tsx
│   │   │       ├── referrals.tsx
│   │   │       └── analytics.tsx
│   │   │
│   │   ├── providers/                # React context providers
│   │   │   ├── AccessibilityProvider.tsx
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── TenantProvider.tsx
│   │   │   ├── AIAssistantProvider.tsx # AI Assistant context provider
│   │   │   └── AnalyticsProvider.tsx
│   │   │
│   │   └── styles/                   # CSS/styling
│   │       ├── globals.css
│   │       └── theme.css
│   │
│   ├── config/                       # Application configuration
│   │   ├── apiConfig.ts
│   │   ├── authConfig.ts
│   │   ├── tenantConfig.ts
│   │   ├── assistantConfig.ts        # AI Assistant configuration
│   │   └── featureFlags.ts
│   │
│   └── utils/                        # Helper functions
│       ├── date.ts
│       ├── formatting.ts
│       ├── validation.ts
│       ├── accessibility.ts
│       ├── workflow.ts               # Workflow processing utilities
│       └── analytics.ts
│
├── tests/                            # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── scripts/                          # Build/deploy scripts
│
├── docs/                             # Documentation
│   ├── architecture/
│   ├── api/
│   ├── workflows/
│   ├── ai-assistant/                 # AI Assistant documentation
│   │   ├── workflow-schema.md
│   │   ├── audio-guide.md
│   │   ├── assistant-design.md
│   │   └── testing.md
│   └── deployment/
│
├── .env.example                      # Environment variables example
├── .env.local                        # Local environment variables (gitignored)
├── .env.development                  # Development environment variables
├── .env.production                   # Production environment variables
├── .eslintrc.js                      # ESLint configuration
├── .prettierrc                       # Prettier configuration
├── jest.config.js                    # Jest configuration
├── next.config.js                    # Next.js configuration
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.js                # Tailwind CSS configuration
└── README.md                         # Project overview
```

## Key Implementation Components

### 1. AI Assistant Workflow Engine

```typescript
// src/core/ai/WorkflowEngine.ts
import { ConversationStatus, AIAssistantState, PatientIntent } from './AIAssistantTypes';

export class WorkflowEngine {
  private workflows: Map<string, any>;
  private currentState: AIAssistantState;
  private audioContext: AudioContext | null = null;
  
  constructor() {
    this.workflows = new Map();
    this.currentState = this.getInitialState();
    this.loadWorkflows();
  }
  
  private getInitialState(): AIAssistantState {
    return {
      isActive: false,
      conversationStatus: 'IDLE',
      detectedEntities: {},
      conversationHistory: [],
      currentPath: '',
      voiceEnabled: true,
      voiceConfig: {
        voiceId: 'default',
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0,
        use_speaker_boost: true,
        speed: 1.0
      },
      sessionId: `session-${Date.now()}`
    };
  }
  
  private async loadWorkflows() {
    // In a production app, these would be fetched from the server
    // For local testing, we'll import them directly
    const welcome = await import('./workflows/welcome.json');
    const appointment = await import('./workflows/appointment.json');
    const payment = await import('./workflows/payment.json');
    const insurance = await import('./workflows/insurance.json');
    
    this.workflows.set('welcome', welcome.default);
    this.workflows.set('appointment', appointment.default);
    this.workflows.set('payment', payment.default);
    this.workflows.set('insurance', insurance.default);
  }
  
  public getState(): AIAssistantState {
    return { ...this.currentState };
  }
  
  public updateState(partial: Partial<AIAssistantState>): AIAssistantState {
    this.currentState = { ...this.currentState, ...partial };
    return this.currentState;
  }
  
  public async startWorkflow(workflowId: string, initialContext: Record<string, any> = {}): Promise<any> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }
    
    this.updateState({
      isActive: true,
      conversationStatus: 'PROCESSING',
      currentWorkflowId: workflowId,
      currentStepId: workflow.initialStep,
      workflowContext: initialContext
    });
    
    return this.processCurrentStep();
  }
  
  public async playAudio(audioFile: string): Promise<void> {
    if (!this.currentState.voiceEnabled) return Promise.resolve();
    
    try {
      // Update state to indicate speaking
      this.updateState({ conversationStatus: 'SPEAKING' });
      
      // Create audio element and play
      const audio = new Audio(`/audio/${audioFile}`);
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          this.updateState({ conversationStatus: 'AWAITING_INPUT' });
          resolve();
        };
        
        audio.onerror = (error) => {
          console.error('Error playing audio:', error);
          this.updateState({ conversationStatus: 'ERROR' });
          reject(error);
        };
        
        audio.play().catch(reject);
      });
    } catch (error) {
      console.error('Error setting up audio playback:', error);
      this.updateState({ conversationStatus: 'ERROR' });
      throw error;
    }
  }
  
  private async processCurrentStep() {
    const { currentWorkflowId, currentStepId } = this.currentState;
    if (!currentWorkflowId || !currentStepId) return null;
    
    const workflow = this.workflows.get(currentWorkflowId);
    const step = workflow.steps.find((s: any) => s.id === currentStepId);
    
    if (!step) return null;
    
    // Execute any pre-actions
    if (step.actions?.beforeStep) {
      await this.executeActions(step.actions.beforeStep);
    }
    
    // Play audio if available
    if (step.audioFile) {
      await this.playAudio(step.audioFile);
    }
    
    return step;
  }
  
  public async selectChoice(choiceId: string) {
    const { currentWorkflowId, currentStepId } = this.currentState;
    if (!currentWorkflowId || !currentStepId) return null;
    
    const workflow = this.workflows.get(currentWorkflowId);
    const currentStep = workflow.steps.find((s: any) => s.id === currentStepId);
    
    if (!currentStep) return null;
    
    // Find the selected choice
    const choice = currentStep.choices.find((c: any) => c.id === choiceId);
    if (!choice) return null;
    
    // Execute any choice actions
    if (choice.actions) {
      await this.executeActions(choice.actions);
    }
    
    // Move to next step if specified
    if (choice.nextStepId) {
      this.updateState({ 
        currentStepId: choice.nextStepId,
        conversationStatus: 'PROCESSING' 
      });
      
      return this.processCurrentStep();
    }
    
    // If no next step, close the assistant
    if (!choice.nextStepId) {
      this.updateState({ 
        isActive: false,
        conversationStatus: 'COMPLETED' 
      });
    }
    
    return null;
  }
  
  private async executeActions(actions: string[]) {
    for (const action of actions) {
      if (action.startsWith('navigate:')) {
        const path = action.split(':')[1];
        window.location.href = path;
      } else if (action.startsWith('fill:')) {
        const [_, formId, fieldId, value] = action.split(':');
        const element = document.getElementById(fieldId) as HTMLInputElement;
        if (element) {
          element.value = value;
          element.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      // More action types can be added here
    }
  }
}
```

### 2. Assistant Provider Component

```tsx
// src/ui/providers/AIAssistantProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { WorkflowEngine } from '@/core/ai/WorkflowEngine';
import { AIAssistantState, ChoiceOption } from '@/core/ai/AIAssistantTypes';

interface AIAssistantContextType {
  state: AIAssistantState;
  isActive: boolean;
  currentStep: any;
  startAssistant: (workflowId: string, context?: Record<string, any>) => Promise<void>;
  dismissAssistant: () => void;
  selectChoice: (choiceId: string) => Promise<void>;
  toggleVoice: () => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export const AIAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [engine] = useState(() => new WorkflowEngine());
  const [state, setState] = useState<AIAssistantState>(engine.getState());
  const [currentStep, setCurrentStep] = useState<any>(null);
  
  // Update component state when engine state changes
  useEffect(() => {
    const unsubscribe = engine.subscribe((newState) => {
      setState(newState);
    });
    
    return () => unsubscribe();
  }, [engine]);
  
  // Start the welcome workflow on first visit
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore && router.pathname === '/') {
      startAssistant('welcome');
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, [router.pathname]);
  
  const startAssistant = async (workflowId: string, context?: Record<string, any>) => {
    try {
      const step = await engine.startWorkflow(workflowId, context);
      setCurrentStep(step);
    } catch (error) {
      console.error('Error starting assistant:', error);
    }
  };
  
  const dismissAssistant = () => {
    engine.updateState({ isActive: false, conversationStatus: 'IDLE' });
    setCurrentStep(null);
  };
  
  const selectChoice = async (choiceId: string) => {
    try {
      const nextStep = await engine.selectChoice(choiceId);
      setCurrentStep(nextStep);
    } catch (error) {
      console.error('Error selecting choice:', error);
    }
  };
  
  const toggleVoice = () => {
    const voiceEnabled = !state.voiceEnabled;
    engine.updateState({ voiceEnabled });
  };
  
  const value = {
    state,
    isActive: state.isActive,
    currentStep,
    startAssistant,
    dismissAssistant,
    selectChoice,
    toggleVoice
  };
  
  return (
    <AIAssistantContext.Provider value={value}>
      {children}
    </AIAssistantContext.Provider>
  );
};

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
};
```

### 3. Assistant Component

```tsx
// src/ui/components/ai-assistant/Assistant.tsx
import React, { useEffect } from 'react';
import { useAIAssistant } from '@/ui/providers/AIAssistantProvider';
import { PopupMessage } from './PopupMessage';
import { ChoiceSelector } from './ChoiceSelector';
import { VisualEffects } from './VisualEffects';

export const Assistant: React.FC = () => {
  const { 
    isActive, 
    currentStep, 
    state, 
    startAssistant, 
    dismissAssistant, 
    selectChoice,
    toggleVoice
  } = useAIAssistant();
  
  // Show visual effects based on step configuration
  const showVisualEffects = currentStep?.visualEffects;
  
  // Determine assistant display type
  const displayType = currentStep?.displayType || 'popup';
  
  return (
    <>
      {/* Floating assistant button */}
      <button 
        className="fixed bottom-4 right-4 z-50 rounded-full bg-blue-600 text-white p-4 shadow-lg hover:bg-blue-700 transition-all"
        onClick={() => isActive ? dismissAssistant() : startAssistant('welcome')}
      >
        {isActive ? (
          <span>Close Assistant</span>
        ) : (
          <span>Need Help?</span>
        )}
      </button>
      
      {/* Assistant UI based on display type */}
      {isActive && currentStep && (
        <>
          {displayType === 'popup' && (
            <PopupMessage
              message={currentStep.text}
              isOpen={true}
              onClose={dismissAssistant}
              type="info"
              position="center"
              useVoice={state.voiceEnabled}
              voiceId={state.voiceConfig.voiceId}
              conversationStatus={state.conversationStatus}
            />
          )}
          
          {displayType === 'choices' && (
            <ChoiceSelector
              title={currentStep.title || 'Select an Option'}
              description={currentStep.text}
              choices={currentStep.choices}
              onSelect={selectChoice}
              onCancel={dismissAssistant}
              isOpen={true}
              showIcons={true}
            />
          )}
          
          {/* Visual effects */}
          {showVisualEffects && (
            <VisualEffects
              type={showVisualEffects.animation}
              duration={showVisualEffects.duration}
              colors={showVisualEffects.colors}
            />
          )}
          
          {/* Sound toggle */}
          <button
            className="fixed bottom-20 right-4 z-50 rounded-full bg-gray-100 p-2 shadow-md"
            onClick={toggleVoice}
          >
            {state.voiceEnabled ? (
              <span>Sound On</span>
            ) : (
              <span>Sound Off</span>
            )}
          </button>
        </>
      )}
    </>
  );
};
```

## Implementation Approach

To implement Premier Healthcare's comprehensive solution with the AI Patient Assistant, we'll follow this revised schedule:

### Phase 1: Core Platform (Completed)
✓ Sprints 1-5: Core functionality, patient intake, referrals, payment

### Phase 2: AI Patient Assistant (Sprint 6)
1. **Core Infrastructure** (Week 1)
   - Define workflow JSON schema
   - Create workflow state management
   - Build UI component library
   - Implement audio playback system

2. **Patient Experience Flows** (Week 2)
   - Welcome/introduction flow
   - Appointment booking assistance flow 
   - Payment guidance flow
   - Insurance help flow
   - Confirmation celebrations

3. **Testing & Refinement** (Week 3)
   - Create sample audio files
   - Test flows with real users
   - Optimize performance
   - Add analytics tracking

### Phase 3: Extended Functionality (Sprints 7-9)
- Analytics & Reporting
- API & Integrations
- Multi-tenant & Commercialization

## Benefits of AI Patient Assistant

1. **Enhanced User Experience**
   - Guides patients through complex workflows
   - Reduces confusion and abandonment
   - Provides immediate feedback and help

2. **Operational Efficiency**
   - Decreases support calls
   - Improves form completion rates
   - Reduces staff time spent on basic assistance

3. **Increased Engagement**
   - More interactive and engaging experience
   - Clear guidance increases confidence
   - Celebratory moments create positive associations

4. **Accessibility Benefits**
   - Audio guidance helps visually impaired users
   - Clear step-by-step instructions assist all users
   - Multiple input options (voice, click, type)

5. **Data-Driven Improvements**
   - Track where users need most assistance
   - Identify pain points in patient journeys
   - Continuously improve workflows based on usage patterns

This AI Patient Assistant will set Premier Healthcare apart by providing an intuitive, guided experience that feels personal and supportive, dramatically improving the patient experience while reducing operational costs.

Would you like me to elaborate on any specific part of this architecture or implementation approach?