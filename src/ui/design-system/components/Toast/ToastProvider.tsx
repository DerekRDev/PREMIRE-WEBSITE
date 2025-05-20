import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastContainer, ToastProps, ToastType } from './Toast';

interface ToastContextValue {
  addToast: (props: Omit<ToastProps, 'id' | 'onClose'>) => string;
  removeToast: (id: string) => void;
  removeAllToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children, position = 'top-right' }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback(
    ({ title, message, type, duration, isClosable }: Omit<ToastProps, 'id' | 'onClose'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      
      setToasts((prevToasts) => [
        ...prevToasts,
        {
          id,
          title,
          message,
          type,
          duration,
          isClosable,
          onClose: (id) => removeToast(id),
        },
      ]);
      
      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, removeAllToasts }}>
      {children}
      <ToastContainer position={position}>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

// Helper functions for common toast types
export const useToastHelpers = () => {
  const { addToast } = useToast();
  
  const success = (message: string, options?: Partial<Omit<ToastProps, 'id' | 'message' | 'type' | 'onClose'>>) => {
    return addToast({ message, type: 'success', ...options });
  };
  
  const error = (message: string, options?: Partial<Omit<ToastProps, 'id' | 'message' | 'type' | 'onClose'>>) => {
    return addToast({ message, type: 'error', ...options });
  };
  
  const warning = (message: string, options?: Partial<Omit<ToastProps, 'id' | 'message' | 'type' | 'onClose'>>) => {
    return addToast({ message, type: 'warning', ...options });
  };
  
  const info = (message: string, options?: Partial<Omit<ToastProps, 'id' | 'message' | 'type' | 'onClose'>>) => {
    return addToast({ message, type: 'info', ...options });
  };
  
  return { success, error, warning, info };
};