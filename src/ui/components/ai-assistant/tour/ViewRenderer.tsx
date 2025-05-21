/**
 * ViewRenderer
 * Handles rendering different view types based on workflow step display type
 */
import React from 'react';
import { WorkflowStep } from '@/core/ai/WorkflowTypes';
import { PopupMessageUpdated } from '../components/PopupMessageUpdated';
import { CelebrationView } from '../components/CelebrationView';
import { ChoiceSelectorUpdated } from '../components/ChoiceSelectorUpdated';

interface ViewRendererProps {
  currentStep: WorkflowStep;
  onChoiceSelected: (choiceId: string) => void;
  onClose: () => void;
}

export const ViewRenderer: React.FC<ViewRendererProps> = ({
  currentStep,
  onChoiceSelected,
  onClose,
}) => {
  // Select the view to render based on the current step's display type
  switch (currentStep.displayType) {
    case "popup":
      return (
        <PopupMessageUpdated
          text={currentStep.text}
          choices={currentStep.choices || []}
          onChoiceSelected={onChoiceSelected}
          onClose={onClose}
          useVoice={false} /* Disabled to avoid duplicate audio - workflow handles audio explicitly */
        />
      );

    case "celebration":
      return (
        <CelebrationView
          text={currentStep.text}
          choices={currentStep.choices || []}
          onChoiceSelected={onChoiceSelected}
          onClose={onClose}
        />
      );

    case "calendar":
      // Assuming you have a CalendarView component
      return (
        <div className="p-6 bg-white rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-4">{currentStep.text}</h2>
          <div className="mb-4">
            {/* Calendar component would go here */}
            <p className="text-gray-500">Calendar selection (placeholder)</p>
          </div>
          <ChoiceSelectorUpdated 
            choices={currentStep.choices || []} 
            onChoiceSelected={onChoiceSelected} 
          />
        </div>
      );

    case "form":
      // Assuming you have a FormView component
      return (
        <div className="p-6 bg-white rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-4">{currentStep.text}</h2>
          <div className="mb-4">
            {/* Form component would go here */}
            <p className="text-gray-500">Form fields (placeholder)</p>
          </div>
          <ChoiceSelectorUpdated 
            choices={currentStep.choices || []} 
            onChoiceSelected={onChoiceSelected} 
          />
        </div>
      );

    default:
      return (
        <div className="p-6 bg-white rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-4">{currentStep.text}</h2>
          <ChoiceSelectorUpdated 
            choices={currentStep.choices || []} 
            onChoiceSelected={onChoiceSelected} 
          />
        </div>
      );
  }
};