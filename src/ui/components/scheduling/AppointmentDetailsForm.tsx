import React from 'react';
import { AppointmentType } from '../../../core/entities/Appointment';
import { AppointmentDetailsFormProps } from './types';

export function AppointmentDetailsForm({
  appointmentType,
  reason,
  notes,
  onTypeChange,
  onReasonChange,
  onNotesChange,
  className = ''
}: AppointmentDetailsFormProps) {
  const handleTypeChange = (value: string) => {
    // Validate that the value is a valid AppointmentType
    if (Object.values(AppointmentType).includes(value as AppointmentType)) {
      onTypeChange(value as AppointmentType);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Appointment Type
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          value={appointmentType || ''}
          onChange={(e) => handleTypeChange(e.target.value)}
        >
          <option value="">Select Type</option>
          {Object.values(AppointmentType).map((type) => (
            <option key={type} value={type}>
              {type.replace(/_/g, ' ').toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Reason for Visit
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          rows={3}
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder="Please describe the reason for your visit"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Additional Notes
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          rows={2}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Any additional information you'd like to share"
        />
      </div>
    </div>
  );
}