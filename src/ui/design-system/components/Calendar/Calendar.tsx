import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '../Button';

export interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  highlightedDates?: Date[];
  className?: string;
}

export const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabledDates = [],
  highlightedDates = [],
  className = '',
}) => {
  // Use provided value or default to current date
  const [currentDate, setCurrentDate] = useState<Date>(value || new Date());
  
  // Get the year and month from the current date
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Calculate the days in the current month
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  // Calculate the first day of the month
  const firstDayOfMonth = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay();
  }, [currentYear, currentMonth]);

  // Format dates for comparison
  const formatDateForComparison = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Check if a date is disabled
  const isDateDisabled = useCallback(
    (date: Date): boolean => {
      // Check if date is in disabled dates array
      const isDisabled = disabledDates.some(
        (disabledDate) => formatDateForComparison(disabledDate) === formatDateForComparison(date)
      );

      // Check if date is outside min/max range
      const isBeforeMin = minDate && date < new Date(minDate.setHours(0, 0, 0, 0));
      const isAfterMax = maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999));

      return isDisabled || isBeforeMin || isAfterMax;
    },
    [disabledDates, minDate, maxDate]
  );

  // Check if a date is highlighted
  const isDateHighlighted = useCallback(
    (date: Date): boolean => {
      return highlightedDates.some(
        (highlightedDate) => formatDateForComparison(highlightedDate) === formatDateForComparison(date)
      );
    },
    [highlightedDates]
  );

  // Check if a date is selected
  const isDateSelected = useCallback(
    (date: Date): boolean => {
      return value ? formatDateForComparison(value) === formatDateForComparison(date) : false;
    },
    [value]
  );

  // Navigate to the previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // Navigate to the next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Handle date selection
  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    
    if (!isDateDisabled(selectedDate)) {
      if (onChange) {
        onChange(selectedDate);
      }
    }
  };

  // Generate days array for the calendar grid
  const daysArray = useMemo(() => {
    const days = [];
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  }, [daysInMonth, firstDayOfMonth]);

  // Day names for the calendar header
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Month names for the calendar header
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="text" 
          onClick={goToPreviousMonth}
          aria-label="Previous Month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <div className="text-lg font-semibold">
          {monthNames[currentMonth]} {currentYear}
        </div>
        <Button 
          variant="text" 
          onClick={goToNextMonth}
          aria-label="Next Month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>

      {/* Day names header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day, index) => (
          <div key={index} className="text-center text-xs font-medium text-neutral-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysArray.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="py-2" />;
          }

          const date = new Date(currentYear, currentMonth, day);
          const isDisabled = isDateDisabled(date);
          const isHighlighted = isDateHighlighted(date);
          const isSelected = isDateSelected(date);
          const isToday = formatDateForComparison(date) === formatDateForComparison(new Date());

          return (
            <button
              key={`day-${day}`}
              type="button"
              onClick={() => handleDateClick(day)}
              disabled={isDisabled}
              className={`
                py-2 rounded-full text-sm text-center
                focus:outline-none focus:ring-2 focus:ring-primary-500
                ${isSelected ? 'bg-primary-500 text-white font-bold' : 'hover:bg-neutral-100'}
                ${isDisabled ? 'text-neutral-300 cursor-not-allowed' : 'cursor-pointer'}
                ${isHighlighted && !isSelected ? 'bg-primary-100' : ''}
                ${isToday && !isSelected ? 'font-bold border border-primary-500' : ''}
              `}
              aria-label={`${monthNames[currentMonth]} ${day}, ${currentYear}`}
              aria-selected={isSelected}
              aria-disabled={isDisabled}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};