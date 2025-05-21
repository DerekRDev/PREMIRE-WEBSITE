import React from 'react';
import { Card } from '../../design-system/components/Card';
import Image from 'next/image';

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
    <div className={`space-y-6 ${className}`}>
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-neutral-800 mb-3">
          Select a Specialty
        </h2>
        <p className="text-neutral-600">
          Choose the type of care you're looking for to find the right healthcare provider.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {specialties.map((specialty) => (
          <div
            key={specialty.id}
            onClick={() => onSelect(specialty.id)}
            className="cursor-pointer transform transition-all duration-200 hover:scale-[1.02]"
          >
            <Card
              className={`h-full transition-all ${
                selectedSpecialty === specialty.id
                  ? 'border-2 border-primary-500 ring-2 ring-primary-200 bg-primary-50'
                  : 'border border-neutral-200 hover:border-primary-200 hover:shadow-md'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {specialty.icon && (
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                        <span className="text-2xl">{specialty.icon}</span>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-800 mb-1">
                      {specialty.name}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {specialty.description}
                    </p>
                  </div>
                </div>

                {selectedSpecialty === specialty.id && (
                  <div className="mt-4 pt-4 border-t border-primary-200">
                    <div className="flex items-center text-primary-700">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-medium">Selected</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>

      {selectedSpecialty && (
        <div className="flex justify-center mt-8">
          <div className="bg-primary-50 rounded-lg px-6 py-4 inline-flex items-center">
            <svg
              className="w-5 h-5 text-primary-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-primary-700">
              Click Next to choose your provider
            </span>
          </div>
        </div>
      )}
    </div>
  );
};