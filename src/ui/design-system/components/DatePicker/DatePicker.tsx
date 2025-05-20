import React, { useState, useRef, useEffect } from 'react';
import { Input } from '../Input';
import { Calendar } from '../Calendar';

export interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  highlightedDates?: Date[];
  isRequired?: boolean;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  className?: string;
  disabled?: boolean;
  dateFormat?: string; // e.g., 'MM/dd/yyyy', 'yyyy-MM-dd'
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Select a date',
  minDate,
  maxDate,
  disabledDates = [],
  highlightedDates = [],
  isRequired = false,
  error = false,
  errorMessage,
  helperText,
  className = '',
  disabled = false,
  dateFormat = 'MM/dd/yyyy',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const calendarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // Format a date as string according to the specified format
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    switch (dateFormat) {
      case 'MM/dd/yyyy':
        return `${month}/${day}/${year}`;
      case 'dd/MM/yyyy':
        return `${day}/${month}/${year}`;
      case 'yyyy-MM-dd':
        return `${year}-${month}-${day}`;
      default:
        return `${month}/${day}/${year}`; // Default to MM/dd/yyyy
    }
  };

  // Format the initial value
  useEffect(() => {
    if (value) {
      setInputValue(formatDate(value));
    }
  }, [value]);

  // Handle clicks outside the calendar to close it
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        isOpen &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Toggle the calendar visibility
  const toggleCalendar = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // Handle date selection from the calendar
  const handleDateSelect = (date: Date) => {
    if (onChange) {
      onChange(date);
    }
    setInputValue(formatDate(date));
    setIsOpen(false);
  };

  // Calendar icon for the input
  const calendarIcon = (
    <svg
      className={`w-5 h-5 ${disabled ? 'text-neutral-400' : 'text-neutral-500'}`}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  return (
    <div className={`relative ${className}`}>
      <div ref={inputRef}>
        <Input
          label={label}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onClick={toggleCalendar}
          placeholder={placeholder}
          rightIcon={calendarIcon}
          readOnly
          isRequired={isRequired}
          error={error}
          errorMessage={errorMessage}
          helperText={helperText}
          disabled={disabled}
        />
      </div>
      
      {isOpen && (
        <div 
          ref={calendarRef}
          className="absolute z-10 mt-1 shadow-lg rounded-lg"
        >
          <Calendar
            value={value}
            onChange={handleDateSelect}
            minDate={minDate}
            maxDate={maxDate}
            disabledDates={disabledDates}
            highlightedDates={highlightedDates}
          />
        </div>
      )}
    </div>
  );
};