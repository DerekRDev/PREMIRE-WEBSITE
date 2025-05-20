import React, { forwardRef } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isRequired?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error = false,
      errorMessage,
      leftIcon,
      rightIcon,
      size = 'medium',
      fullWidth = false,
      isRequired = false,
      className = '',
      disabled = false,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    const sizeClasses = {
      small: 'py-1.5 px-3 text-sm',
      medium: 'py-2 px-4 text-base',
      large: 'py-3 px-5 text-lg',
    };

    const borderClasses = error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500';

    const inputClasses = `
      block 
      bg-white 
      w-full 
      rounded-md 
      border 
      shadow-sm 
      focus:outline-none 
      focus:ring-2 
      ${sizeClasses[size]} 
      ${borderClasses}
      ${disabled ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' : ''} 
      ${leftIcon ? 'pl-10' : ''} 
      ${rightIcon ? 'pr-10' : ''}
      ${className}
    `;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700 mb-1">
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={`${inputId}-helper-text ${inputId}-error-message`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {(helperText || (error && errorMessage)) && (
          <div className="mt-1">
            {helperText && !error && (
              <p id={`${inputId}-helper-text`} className="text-sm text-neutral-500">
                {helperText}
              </p>
            )}
            {error && errorMessage && (
              <p id={`${inputId}-error-message`} className="text-sm text-red-500">
                {errorMessage}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';