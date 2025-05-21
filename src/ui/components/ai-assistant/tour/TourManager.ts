/**
 * TourManager
 * Manages the state and flow of the guided tour
 */
import { useState, useEffect } from 'react';
import { TourStep } from '@/utils/yamlLoader';
import { TourAudioService } from '@/services/TourAudioService';
import { WorkflowStep } from '@/core/ai/WorkflowTypes';

export interface TourState {
  isActive: boolean;
  currentStepIndex: number;
  showTourComplete: boolean;
}

export interface UseTourManagerProps {
  currentWorkflowStep: WorkflowStep | null;
  tourSteps: TourStep[];
  onHideAssistant: () => void;
  onSelectChoice: (choiceId: string) => void;
}

export const useTourManager = ({
  currentWorkflowStep,
  tourSteps,
  onHideAssistant,
  onSelectChoice
}: UseTourManagerProps) => {
  const [tourState, setTourState] = useState<TourState>({
    isActive: false,
    currentStepIndex: 0,
    showTourComplete: false
  });
  
  const audioService = TourAudioService.getInstance();
  
  // Update tour state based on current workflow step
  useEffect(() => {
    if (!currentWorkflowStep) return;
    
    const stepId = currentWorkflowStep.id;
    console.log('Current step ID changed to:', stepId);
    
    // Handle different workflow steps
    switch (stepId) {
      case 'tour_intro':
        handleTourIntro();
        break;
      case 'navigation_overview':
        handleNavigationOverview();
        break;
      case 'appointments_overview':
        handleAppointmentsOverview();
        break;
      case 'intake_overview':
        handleIntakeOverview();
        break;
      case 'profile_overview':
        handleProfileOverview();
        break;
      case 'referrals_overview':
        handleReferralsOverview();
        break;
      case 'billing_overview':
        handleBillingOverview();
        break;
      case 'help_overview':
        handleHelpOverview();
        break;
      case 'tour_complete':
        handleTourComplete();
        break;
    }
  }, [currentWorkflowStep?.id]);
  
  // Handle tour introduction step
  const handleTourIntro = () => {
    setTourState(prev => ({
      ...prev,
      isActive: false,
    }));
    
    if (currentWorkflowStep?.audioFile) {
      audioService.playStepAudio(
        currentWorkflowStep.id, 
        currentWorkflowStep.audioFile
      );
    }
  };
  
  // Handle navigation overview step
  const handleNavigationOverview = () => {
    console.log('Starting tour highlighting for navigation_overview');
    setTourState(prev => ({
      ...prev,
      isActive: true,
      currentStepIndex: 0,
    }));
    
    if (currentWorkflowStep?.audioFile) {
      audioService.playStepAudio(
        currentWorkflowStep.id, 
        currentWorkflowStep.audioFile
      );
    }
  };
  
  // Handle appointments overview step
  const handleAppointmentsOverview = () => {
    console.log('Moving to appointments_overview highlight');
    setTourState(prev => ({
      ...prev,
      isActive: true,
      currentStepIndex: 1,
    }));
    
    if (currentWorkflowStep?.audioFile) {
      audioService.playStepAudio(
        currentWorkflowStep.id, 
        currentWorkflowStep.audioFile
      );
    }
  };
  
  // Handle intake overview step
  const handleIntakeOverview = () => {
    console.log('Moving to intake_overview highlight');
    setTourState(prev => ({
      ...prev,
      isActive: true,
      currentStepIndex: 2,
    }));
    
    if (currentWorkflowStep?.audioFile) {
      audioService.playStepAudio(
        currentWorkflowStep.id, 
        currentWorkflowStep.audioFile
      );
    }
  };
  
  // Handle profile overview step
  const handleProfileOverview = () => {
    console.log('Moving to profile_overview highlight');
    setTourState(prev => ({
      ...prev,
      isActive: true,
      currentStepIndex: 3,
    }));
    
    if (currentWorkflowStep?.audioFile) {
      audioService.playStepAudio(
        currentWorkflowStep.id, 
        currentWorkflowStep.audioFile
      );
    }
  };
  
  // Handle referrals overview step
  const handleReferralsOverview = () => {
    console.log('Moving to referrals_overview highlight');
    setTourState(prev => ({
      ...prev,
      isActive: true,
      currentStepIndex: 4,
    }));
    
    if (currentWorkflowStep?.audioFile) {
      audioService.playStepAudio(
        currentWorkflowStep.id, 
        currentWorkflowStep.audioFile
      );
    }
  };
  
  // Handle billing overview step
  const handleBillingOverview = () => {
    console.log('Moving to billing_overview highlight');
    setTourState(prev => ({
      ...prev,
      isActive: true,
      currentStepIndex: 5,
    }));
    
    if (currentWorkflowStep?.audioFile) {
      audioService.playStepAudio(
        currentWorkflowStep.id, 
        currentWorkflowStep.audioFile
      );
    }
  };
  
  // Handle help overview step
  const handleHelpOverview = () => {
    console.log('Moving to help_overview highlight');
    setTourState(prev => ({
      ...prev,
      isActive: true,
      currentStepIndex: 6,
    }));
    
    if (currentWorkflowStep?.audioFile) {
      audioService.playStepAudio(
        currentWorkflowStep.id, 
        currentWorkflowStep.audioFile
      );
    }
  };
  
  // Handle tour completion step
  const handleTourComplete = () => {
    console.log('Tour complete, showing celebration');
    setTourState(prev => ({
      ...prev,
      isActive: false,
      showTourComplete: true,
    }));
    
    // Stop any playing audio before playing completion sound
    audioService.stopAudio();
    
    // Play tour completion audio
    if (currentWorkflowStep?.audioFile) {
      audioService.playStepAudio(
        currentWorkflowStep.id, 
        currentWorkflowStep.audioFile
      );
    }
  };
  
  // Handle manual tour step change (when user clicks next/prev)
  const handleTourStepChange = (index: number) => {
    console.log(`Manual tour step change to index ${index}`);
    setTourState(prev => ({
      ...prev,
      currentStepIndex: index,
    }));
    
    // Play audio for manually navigated steps
    const currentTourStep = tourSteps[index];
    if (currentTourStep?.audioFile) {
      const stepId = currentTourStep.id || `tour_step_${index}`;
      audioService.playStepAudio(stepId, currentTourStep.audioFile);
    }
  };
  
  // Handle completing the tour
  const handleTourCompleteAction = () => {
    setTourState(prev => ({
      ...prev,
      isActive: false,
      showTourComplete: true,
    }));
    
    if (currentWorkflowStep?.audioFile && currentWorkflowStep.id === 'tour_complete') {
      audioService.playStepAudio(currentWorkflowStep.id, currentWorkflowStep.audioFile);
    }
  };
  
  // Handle closing the tour complete screen
  const handleTourCompleteClose = () => {
    setTourState(prev => ({
      ...prev,
      showTourComplete: false,
    }));
    
    // Continue with workflow
    if (currentWorkflowStep?.choices && currentWorkflowStep.choices.length > 0) {
      // Find the "continue" choice
      const continueChoice = currentWorkflowStep.choices.find(choice => 
        choice.id === 'continue_tour' || choice.id === 'continue'
      );
      
      if (continueChoice) {
        onSelectChoice(continueChoice.id);
      }
    }
  };
  
  // Handle closing the tour
  const handleCloseTour = () => {
    setTourState(prev => ({
      ...prev,
      isActive: false,
    }));
    
    audioService.stopAudio();
    onHideAssistant();
  };

  return {
    tourState,
    handleTourStepChange,
    handleTourCompleteAction,
    handleTourCompleteClose,
    handleCloseTour,
  };
};