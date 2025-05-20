import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options?: SelectOption[];
  helperText?: string;
  error?: boolean | string;
  errorMessage?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isRequired?: boolean;
  placeholder?: string;
  children?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      helperText,
      error = false,
      errorMessage,
      size = 'medium',
      fullWidth = false,
      isRequired = false,
      className = '',
      disabled = false,
      id,
      placeholder,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
    const hasError = error === true || typeof error === 'string';
    const errorText = typeof error === 'string' ? error : errorMessage;

    const sizeClasses = {
      small: 'py-1.5 pl-3 pr-10 text-sm',
      medium: 'py-2 pl-4 pr-10 text-base',
      large: 'py-3 pl-5 pr-10 text-lg',
    };

    const borderClasses = hasError
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500';

    const selectClasses = `
      block 
      w-full 
      rounded-md 
      border 
      bg-white 
      shadow-sm 
      focus:outline-none 
      focus:ring-2 
      ${sizeClasses[size]} 
      ${borderClasses}
      ${disabled ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' : ''} 
      ${className}
    `;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-neutral-700 mb-1">
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={selectClasses}
            disabled={disabled}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={`${selectId}-helper-text ${selectId}-error-message`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options ? (
              options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))
            ) : (
              children
            )}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {(helperText || (hasError && errorText)) && (
          <div className="mt-1">
            {helperText && !hasError && (
              <p id={`${selectId}-helper-text`} className="text-sm text-neutral-500">
                {helperText}
              </p>
            )}
            {hasError && errorText && (
              <p id={`${selectId}-error-message`} className="text-sm text-red-500">
                {errorText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';