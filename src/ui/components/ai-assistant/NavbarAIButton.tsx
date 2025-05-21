"use client";

import React, { useContext, useEffect, useState } from 'react';
import { useAIAssistant } from '@/ui/providers/ai-assistant/AIAssistantProvider';
import { MenuContext } from '@/ui/components/common/Header';

interface NavbarAIButtonProps {
  className?: string;
}

/**
 * AI Assistant Button for the navbar
 */
export const NavbarAIButton: React.FC<NavbarAIButtonProps> = ({ className = "" }) => {
  const { initialize, startWorkflow, state } = useAIAssistant();
  const { setIsMenuOpen } = useContext(MenuContext);
  const [isMobile, setIsMobile] = useState(false);
  const [isInTour, setIsInTour] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the md breakpoint in Tailwind
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Keep menu open during tour on mobile
  useEffect(() => {
    if (isMobile && state.currentWorkflowId === 'welcome') {
      setIsInTour(true);
      setIsMenuOpen(true);
    } else if (isMobile && isInTour && !state.currentWorkflowId) {
      // Tour ended
      setIsInTour(false);
      setIsMenuOpen(false);
    }
  }, [isMobile, state.currentWorkflowId, setIsMenuOpen, isInTour]);

  const handleClick = () => {
    // Initialize when clicked
    initialize();
    
    // On mobile, open the menu before starting the workflow
    if (isMobile) {
      setIsMenuOpen(true);
      setIsInTour(true);
    }
    
    // Launch the welcome workflow
    try {
      startWorkflow('welcome');
    } catch (error) {
      console.error('Error starting workflow:', error);
      // Reset tour state on error
      setIsInTour(false);
      if (isMobile) setIsMenuOpen(false);
    }
  };

  return (
    <button
      className={`bg-primary-600 hover:bg-primary-700 text-white rounded-md px-4 py-2 flex items-center justify-center gap-2 ${className}`}
      onClick={handleClick}
      aria-label="Open AI Assistant"
    >
      <span className="font-medium text-sm">AI</span>
    </button>
  );
};