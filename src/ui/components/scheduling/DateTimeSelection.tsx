import React, { useState, useEffect } from 'react';
import { Calendar } from '../../design-system/components/Calendar';
import { TimeSlotGrid } from './TimeSlotGrid';
import { TimeSlot as CoreTimeSlot } from '../../../core/entities/Appointment';

export interface UITimeSlot {
  startTime: string; // ISO format date-time
  endTime: string;   // ISO format date-time
  providerId: string;
  providerName: string;
  locationId: string;
  locationName: string;
}

export interface DateTimeSelectionProps {
  availableSlots: UITimeSlot[];
  selectedSlot?: UITimeSlot;
  onSelectSlot: (slot: UITimeSlot) => void;
  className?: string;
}

export const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  availableSlots,
  onSelectSlot,
  selectedSlot,
  className = '',
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slotsForSelectedDate, setSlotsForSelectedDate] = useState<UITimeSlot[]>([]);
  
  // Find the available dates from the available slots
  const availableDates = React.useMemo(() => {
    const dates = new Set<string>();
    
    availableSlots.forEach(slot => {
      const slotDate = new Date(slot.startTime);
      dates.add(slotDate.toISOString().split('T')[0]);
    });
    
    return Array.from(dates).map(dateStr => new Date(dateStr));
  }, [availableSlots]);
  
  // Filter slots for the selected date
  useEffect(() => {
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    
    const filtered = availableSlots.filter(slot => {
      const slotDate = new Date(slot.startTime);
      return slotDate.toISOString().split('T')[0] === selectedDateStr;
    });
    
    setSlotsForSelectedDate(filtered);
  }, [availableSlots, selectedDate]);
  
  // Generate dates for min and max constraints
  const today = new Date();
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(today.getMonth() + 6);
  
  return (
    <div className={`space-y-6 ${className}`}>
      <h2 className="text-xl font-bold text-neutral-800 mb-4">
        Select a date & time
      </h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-auto">
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            minDate={today}
            maxDate={sixMonthsFromNow}
            highlightedDates={availableDates}
            className="md:w-80"
          />
          
          <div className="mt-4 text-sm text-neutral-600">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-primary-100 mr-2"></div>
              <span>Dates with available slots</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-primary-500 mr-2"></div>
              <span>Selected date</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-medium text-neutral-800 mb-3">
            Available time slots
          </h3>
          
          {slotsForSelectedDate.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 border border-dashed border-neutral-300 rounded-lg">
              No available time slots on the selected date.
              <br />
              Please select another date.
            </div>
          ) : (
            <TimeSlotGrid
              timeSlots={slotsForSelectedDate}
              selectedSlot={selectedSlot}
              onSelectSlot={onSelectSlot}
            />
          )}
        </div>
      </div>
    </div>
  );
};