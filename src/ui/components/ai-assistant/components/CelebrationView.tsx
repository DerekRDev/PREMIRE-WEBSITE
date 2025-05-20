import React from 'react';
import { Choice } from '../../../../hooks/useAIAssistant';

interface CelebrationViewProps {
  text: string;
  choices: Choice[];
  onChoiceSelected: (choiceId: string) => void;
  onClose: () => void;
}

export const CelebrationView: React.FC<CelebrationViewProps> = ({
  text,
  choices,
  onChoiceSelected,
  onClose
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-xl text-center">
      <div className="text-4xl mb-4">🎉</div>
      <p className="mb-4">{text}</p>
      {/* Rest of celebration view implementation */}
    </div>
  );
};
