import React from 'react';
import { Choice } from '@/core/ai/WorkflowTypes';

interface ChoiceSelectorUpdatedProps {
  choices: Choice[];
  onChoiceSelected: (choiceId: string) => void;
}

export const ChoiceSelectorUpdated: React.FC<ChoiceSelectorUpdatedProps> = ({
  choices,
  onChoiceSelected
}) => {
  return (
    <div className="flex flex-col space-y-2">
      {choices.map(choice => (
        <button
          key={choice.id}
          onClick={() => onChoiceSelected(choice.id)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {choice.text}
        </button>
      ))}
    </div>
  );
};
