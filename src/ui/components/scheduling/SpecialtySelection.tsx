import React from 'react';
import { Card } from '../../design-system/components/Card';

interface Specialty {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface SpecialtySelectionProps {
  specialties: Specialty[];
  selectedSpecialty?: string;
  onSelect: (specialtyId: string) => void;
  className?: string;
}

export const SpecialtySelection: React.FC<SpecialtySelectionProps> = ({
  specialties,
  selectedSpecialty,
  onSelect,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-bold text-neutral-800 mb-4">
        Select a specialty
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specialties.map((specialty) => (
          <Card
            key={specialty.id}
            className={`cursor-pointer transition-shadow p-4 hover:shadow-md ${
              selectedSpecialty === specialty.id
                ? 'border-2 border-primary-500'
                : 'border border-neutral-200'
            }`}
            onClick={() => onSelect(specialty.id)}
          >
            <div className="flex items-center">
              {specialty.icon && (
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    {/* This is a placeholder for an actual icon */}
                    <span className="text-xl">{specialty.icon}</span>
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="font-medium text-lg text-neutral-800">
                  {specialty.name}
                </h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {specialty.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};