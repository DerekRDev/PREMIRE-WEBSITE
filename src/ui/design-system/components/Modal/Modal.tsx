import React, { Fragment, useEffect, useState } from 'react';
import { Button } from '../Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  closeOnEsc?: boolean;
  closeOnOverlayClick?: boolean;
  hideCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnEsc = true,
  closeOnOverlayClick = true,
  hideCloseButton = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      // Add a slight delay to allow CSS transitions to work properly
      setTimeout(() => setIsVisible(true), 10);
      document.body.classList.add('overflow-hidden');
      document.addEventListener('keydown', handleKeyDown);
    } else {
      setIsVisible(false);
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) {
    return null;
  }

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`bg-white rounded-lg shadow-xl transform transition-all duration-300 ${
          sizeClasses[size]
        } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        {/* Header */}
        {(title || !hideCloseButton) && (
          <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-200">
            {title && <h3 className="text-lg font-medium text-neutral-900">{title}</h3>}
            {!hideCloseButton && (
              <button
                type="button"
                className="text-neutral-400 hover:text-neutral-500 focus:outline-none"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export interface ModalFooterProps {
  children?: React.ReactNode;
  cancelButton?: boolean;
  submitButton?: boolean;
  cancelText?: string;
  submitText?: string;
  onCancel?: () => void;
  onSubmit?: () => void;
  isSubmitDisabled?: boolean;
  isSubmitLoading?: boolean;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  cancelButton = true,
  submitButton = true,
  cancelText = 'Cancel',
  submitText = 'Submit',
  onCancel,
  onSubmit,
  isSubmitDisabled = false,
  isSubmitLoading = false,
}) => {
  return (
    <div className="flex justify-end space-x-3">
      {children}
      {cancelButton && (
        <Button variant="outline" onClick={onCancel}>
          {cancelText}
        </Button>
      )}
      {submitButton && (
        <Button 
          variant="primary" 
          onClick={onSubmit} 
          disabled={isSubmitDisabled}
          isLoading={isSubmitLoading}
        >
          {submitText}
        </Button>
      )}
    </div>
  );
};