import React from 'react';

interface TimeSlot {
  startTime: string; // ISO format date-time
  endTime: string;   // ISO format date-time
  providerId: string;
  providerName: string;
  locationId: string;
  locationName: string;
}

export interface TimeSlotGridProps {
  timeSlots: TimeSlot[];
  selectedSlot?: TimeSlot;
  onSelectSlot: (slot: TimeSlot) => void;
  className?: string;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  timeSlots,
  selectedSlot,
  onSelectSlot,
  className = '',
}) => {
  // Group time slots by time of day: morning, afternoon, evening
  const groupedSlots = React.useMemo(() => {
    const morning: TimeSlot[] = [];
    const afternoon: TimeSlot[] = [];
    const evening: TimeSlot[] = [];
    
    timeSlots.forEach(slot => {
      const hours = new Date(slot.startTime).getHours();
      
      if (hours < 12) {
        morning.push(slot);
      } else if (hours < 17) {
        afternoon.push(slot);
      } else {
        evening.push(slot);
      }
    });
    
    return { morning, afternoon, evening };
  }, [timeSlots]);
  
  // Format a time slot's start time for display
  const formatTime = (isoTime: string): string => {
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };
  
  // Check if a slot is selected
  const isSelected = (slot: TimeSlot): boolean => {
    return selectedSlot?.startTime === slot.startTime && 
           selectedSlot?.providerId === slot.providerId;
  };
  
  // Render a time of day section with its slots
  const renderTimeOfDaySection = (title: string, slots: TimeSlot[]) => {
    if (slots.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h4 className="text-sm font-medium text-neutral-600 mb-2">{title}</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {slots.map((slot, index) => (
            <button
              key={`${slot.providerId}-${index}`}
              className={`
                py-2 px-3 text-sm rounded-md
                hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500
                transition-all
                ${
                  isSelected(slot)
                    ? 'bg-primary-500 text-white font-medium'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:border-primary-300'
                }
              `}
              onClick={() => onSelectSlot(slot)}
            >
              {formatTime(slot.startTime)}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      {renderTimeOfDaySection('Morning', groupedSlots.morning)}
      {renderTimeOfDaySection('Afternoon', groupedSlots.afternoon)}
      {renderTimeOfDaySection('Evening', groupedSlots.evening)}
      
      {selectedSlot && (
        <div className="mt-6 p-3 bg-primary-50 border border-primary-100 rounded-md">
          <p className="text-sm font-medium text-primary-800">
            You selected: {formatTime(selectedSlot.startTime)} with {selectedSlot.providerName}
          </p>
          <p className="text-xs text-primary-600 mt-1">
            at {selectedSlot.locationName}
          </p>
        </div>
      )}
    </div>
  );
};