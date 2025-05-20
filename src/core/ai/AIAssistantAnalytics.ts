/**
 * Analytics service for tracking AI Assistant usage
 */

// Event types for analytics
export type AIAssistantEventType =
  | 'assistant_open'
  | 'assistant_close'
  | 'workflow_start'
  | 'workflow_complete'
  | 'choice_selected'
  | 'audio_played'
  | 'error';

// Event data interface
export interface AIAssistantEvent {
  type: AIAssistantEventType;
  timestamp: number;
  workflowId?: string;
  stepId?: string;
  choiceId?: string;
  audioFile?: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

/**
 * Analytics service for the AI Assistant
 */
export class AIAssistantAnalytics {
  private static instance: AIAssistantAnalytics;
  private events: AIAssistantEvent[] = [];
  private sessionId: string;
  private isEnabled: boolean = true;

  private constructor() {
    this.sessionId = `session_${Date.now()}`;
    console.log(`AI Assistant Analytics initialized with session ID: ${this.sessionId}`);
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): AIAssistantAnalytics {
    if (!AIAssistantAnalytics.instance) {
      AIAssistantAnalytics.instance = new AIAssistantAnalytics();
    }
    return AIAssistantAnalytics.instance;
  }

  /**
   * Track an event
   */
  public trackEvent(event: Omit<AIAssistantEvent, 'timestamp'>): void {
    if (!this.isEnabled) return;

    const fullEvent: AIAssistantEvent = {
      ...event,
      timestamp: Date.now(),
    };

    this.events.push(fullEvent);
    
    // For development, log to console
    console.log(`[AI Assistant Analytics] ${event.type}`, fullEvent);
    
    // In a real implementation, you would send this to your analytics service
    // this.sendToAnalyticsService(fullEvent);
  }

  /**
   * Enable analytics
   */
  public enable(): void {
    this.isEnabled = true;
  }

  /**
   * Disable analytics
   */
  public disable(): void {
    this.isEnabled = false;
  }

  /**
   * Get all tracked events
   */
  public getEvents(): AIAssistantEvent[] {
    return [...this.events];
  }

  /**
   * Clear all events
   */
  public clearEvents(): void {
    this.events = [];
  }

  /**
   * Get session ID
   */
  public getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Send event to analytics service
   * This is a placeholder - in a real implementation, you would send this to your analytics service
   */
  private sendToAnalyticsService(event: AIAssistantEvent): void {
    // In a real implementation, you would send this to your analytics service
    // Example:
    // fetch('/api/analytics/track', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     ...event,
    //     sessionId: this.sessionId,
    //   }),
    // });
  }
}