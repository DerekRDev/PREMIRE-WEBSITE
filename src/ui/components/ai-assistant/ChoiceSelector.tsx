import React from 'react';
import { Card, Button } from '@/ui/design-system/components';
import { ChoiceOption } from '@/core/ai/AIAssistantTypes';

interface ChoiceSelectorProps {
  title: string;
  description?: string;
  choices: ChoiceOption[];
  onSelect: (choiceId: string) => void;
  onCancel?: () => void;
  isOpen: boolean;
  maxColumns?: 1 | 2 | 3;
  showIcons?: boolean;
}

export const ChoiceSelector: React.FC<ChoiceSelectorProps> = ({
  title,
  description,
  choices,
  onSelect,
  onCancel,
  isOpen,
  maxColumns = 2,
  showIcons = true
}) => {
  if (!isOpen) return null;

  // Determine grid layout based on maxColumns
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }[maxColumns];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="choice-selector">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" aria-hidden="true"></div>

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block w-full max-w-3xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
              {description && (
                <p className="mt-2 text-sm text-gray-500">{description}</p>
              )}

              {/* Choices grid */}
              <div className={`mt-6 grid ${gridClass} gap-4`}>
                {choices.map((choice) => (
                  <Card 
                    key={choice.id}
                    hoverable
                    className="cursor-pointer transition-transform transform hover:scale-105"
                    onClick={() => onSelect(choice.id)}
                  >
                    <div className="flex items-start">
                      {showIcons && choice.iconUrl && (
                        <div className="flex-shrink-0 w-12 h-12 mr-4">
                          {choice.iconUrl.includes('svg:') ? (
                            // Render SVG icon directly
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                              <span dangerouslySetInnerHTML={{ 
                                __html: choice.iconUrl.replace('svg:', '') 
                              }} />
                            </div>
                          ) : (
                            // Render image icon
                            <img 
                              src={choice.iconUrl} 
                              alt={choice.label} 
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="text-md font-medium">{choice.label}</h4>
                        {choice.description && (
                          <p className="text-sm text-gray-500 mt-1">{choice.description}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                {onCancel && (
                  <Button
                    variant="outline"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};