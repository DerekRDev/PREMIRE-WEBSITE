import React from 'react';
import { Specialty } from '../../../core/entities/Provider';
import { SpecialtySelectionProps } from './types';
import { Card } from '../../design-system/components/Card';

export function SpecialtySelection({
  specialties,
  selectedSpecialty,
  onSelect,
  className = ''
}: SpecialtySelectionProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {specialties.map((specialty) => (
        <button
          key={specialty.id}
          type="button"
          className="w-full text-left focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
          onClick={() => onSelect(specialty.id)}
        >
          <Card
            hoverable
            className={`h-full transition-colors ${
              selectedSpecialty?.id === specialty.id
                ? 'border-primary-500 bg-primary-50'
                : 'hover:border-gray-300'
            }`}
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold">{specialty.name}</h3>
              <p className="text-sm text-gray-600">{specialty.description}</p>
            </div>
          </Card>
        </button>
      ))}
    </div>
  );
}