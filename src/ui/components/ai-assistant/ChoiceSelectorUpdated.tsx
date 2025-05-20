"use client";

import React from 'react';
import { Card, Button } from '@/ui/design-system/components';
import { Choice } from '@/core/ai/WorkflowTypes';

interface ChoiceSelectorProps {
  choices: Choice[];
  onChoiceSelected: (choiceId: string) => void;
  title?: string;
  description?: string;
  maxColumns?: 1 | 2 | 3;
  showIcons?: boolean;
}

export const ChoiceSelectorUpdated: React.FC<ChoiceSelectorProps> = ({
  choices,
  onChoiceSelected,
  title,
  description,
  maxColumns = 2,
  showIcons = true
}) => {
  // Determine grid layout based on maxColumns
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }[maxColumns];

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">{title}</h3>
      )}
      
      {description && (
        <p className="mt-2 text-sm text-gray-500 mb-4">{description}</p>
      )}

      {/* Choices grid */}
      <div className={`grid ${gridClass} gap-4`}>
        {choices.map((choice) => (
          <Card 
            key={choice.id}
            hoverable
            className="cursor-pointer transition-transform transform hover:scale-105"
            onClick={() => {
              console.log('Choice selected:', choice.id);
              onChoiceSelected(choice.id);
            }}
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
                      alt={choice.text} 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                </div>
              )}
              <div className="flex-1">
                <h4 className="text-md font-medium">{choice.text}</h4>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};