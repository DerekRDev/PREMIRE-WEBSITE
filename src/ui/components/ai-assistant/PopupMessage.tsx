import React, { useState, useEffect } from 'react';
import { Button } from '@/ui/design-system/components';
import { getElevenLabsService } from '@/infrastructure/services/ElevenLabsService';
import { ConversationStatus } from '@/core/ai/AIAssistantTypes';

interface PopupMessageProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
  actionLabel?: string;
  autoClose?: number; // Time in ms to auto-close
  position?: 'top' | 'bottom' | 'center';
  type?: 'info' | 'success' | 'warning' | 'error';
  useVoice?: boolean;
  voiceId?: string;
  conversationStatus?: ConversationStatus;
  onStatusChange?: (status: ConversationStatus) => void;
}

export const PopupMessage: React.FC<PopupMessageProps> = ({
  message,
  isOpen,
  onClose,
  onAction,
  actionLabel = 'OK',
  autoClose,
  position = 'bottom',
  type = 'info',
  useVoice = false,
  voiceId,
  conversationStatus,
  onStatusChange
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Set positioning classes based on position prop
  const positionClasses = {
    top: 'top-4 left-1/2 transform -translate-x-1/2',
    bottom: 'bottom-4 left-1/2 transform -translate-x-1/2',
    center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  };
  
  // Set styling based on message type
  const typeClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    error: 'bg-red-50 border-red-200 text-red-700'
  };
  
  // Handle voice synthesis for the message
  useEffect(() => {
    if (isOpen && useVoice && message && conversationStatus !== 'SPEAKING') {
      setIsSpeaking(true);
      
      if (onStatusChange) {
        onStatusChange('SPEAKING');
      }
      
      const elevenLabsService = getElevenLabsService();
      elevenLabsService.speak(message, { voiceId })
        .then(() => {
          setIsSpeaking(false);
          if (onStatusChange) {
            onStatusChange('IDLE');
          }
        })
        .catch(error => {
          console.error('Error speaking message:', error);
          setIsSpeaking(false);
          if (onStatusChange) {
            onStatusChange('ERROR');
          }
        });
    }
  }, [isOpen, message, useVoice, voiceId, conversationStatus, onStatusChange]);
  
  // Handle auto-close timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isOpen) {
      setIsVisible(true);
      
      if (autoClose && !isSpeaking) {
        timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            onClose();
          }, 300); // Wait for fade-out animation
        }, autoClose);
      }
    } else {
      setIsVisible(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, autoClose, onClose, isSpeaking]);
  
  // Don't render anything if not open
  if (!isOpen) return null;
  
  return (
    <div 
      className={`fixed z-50 ${positionClasses[position]} transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      role="alert"
    >
      <div className={`${typeClasses[type]} rounded-lg shadow-lg border p-4 max-w-md`}>
        <div className="flex items-start">
          {/* Icon based on type */}
          <div className="flex-shrink-0">
            {type === 'info' && (
              <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            )}
            {type === 'success' && (
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {type === 'warning' && (
              <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {type === 'error' && (
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          
          {/* Message content */}
          <div className="ml-3 flex-1">
            <p className="text-sm">{message}</p>
            
            {/* Voice indicator */}
            {isSpeaking && (
              <div className="mt-2 flex items-center">
                <div className="relative w-16 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="absolute inset-0 flex space-x-1 px-1 items-center">
                    <div className="w-1 h-2 bg-blue-600 rounded-full animate-waveform-1"></div>
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-waveform-2"></div>
                    <div className="w-1 h-3 bg-blue-600 rounded-full animate-waveform-3"></div>
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-waveform-2"></div>
                    <div className="w-1 h-2 bg-blue-600 rounded-full animate-waveform-1"></div>
                  </div>
                </div>
                <span className="ml-2 text-xs text-gray-500">Speaking...</span>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="mt-3 flex space-x-2">
              {onAction && (
                <Button 
                  size="small"
                  onClick={onAction}
                  disabled={isSpeaking}
                >
                  {actionLabel}
                </Button>
              )}
              <Button 
                variant="outline" 
                size="small"
                onClick={onClose}
                disabled={isSpeaking}
              >
                {onAction ? 'Cancel' : 'Close'}
              </Button>
            </div>
          </div>
          
          {/* Close button */}
          <div className="ml-4 flex-shrink-0 flex">
            <button
              type="button"
              className="inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
              onClick={onClose}
              disabled={isSpeaking}
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};