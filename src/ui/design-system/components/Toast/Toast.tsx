import React, { useEffect, useState } from 'react';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastProps {
  id: string;
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
  isClosable?: boolean;
  onClose?: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  type = 'info',
  duration = 5000,
  isClosable = true,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) {
        onClose(id);
      }
    }, 300); // Allow time for exit animation
  };

  const typeClasses = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      icon: (
        <svg className="w-5 h-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      icon: (
        <svg className="w-5 h-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      icon: (
        <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      icon: (
        <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`
        flex w-full max-w-md 
        border 
        rounded-lg 
        shadow-lg 
        p-4 
        mb-4 
        transition-all duration-300
        transform 
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
        ${typeClasses[type].bg} 
        ${typeClasses[type].border}
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex-shrink-0">{typeClasses[type].icon}</div>
      <div className="ml-3 flex-grow">
        {title && <h3 className="text-sm font-medium">{title}</h3>}
        <div className={`text-sm ${title ? 'mt-1' : ''}`}>{message}</div>
      </div>
      {isClosable && (
        <button
          type="button"
          className="ml-auto flex-shrink-0 -mr-1 -mt-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
          onClick={handleClose}
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  children: React.ReactNode;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ 
  position = 'top-right',
  children 
}) => {
  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-center': 'top-0 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-0 left-1/2 transform -translate-x-1/2',
  };

  return (
    <div
      className={`fixed z-50 p-4 ${positionClasses[position]} max-h-screen overflow-hidden pointer-events-none`}
    >
      <div className="flex flex-col items-center pointer-events-auto">
        {children}
      </div>
    </div>
  );
};