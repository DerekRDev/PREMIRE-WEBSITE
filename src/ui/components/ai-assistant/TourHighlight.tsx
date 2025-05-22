"use client";

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface TourHighlightProps {
  selector?: string;        // CSS selector for the element to highlight
  elementId?: string;       // ID of the element to highlight
  title: string;            // Title of the highlighted feature
  description: string;      // Description of the highlighted feature
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'; // Position of the tooltip
  onNext?: () => void;      // Callback for next step
  onPrevious?: () => void;  // Callback for previous step
  onClose?: () => void;     // Callback for closing the tour
  isLast?: boolean;         // Is this the last step in the tour
  isFirst?: boolean;        // Is this the first step in the tour
  tourType?: string;        // Type of tour to determine overlay behavior
}

export const TourHighlight: React.FC<TourHighlightProps> = ({
  selector,
  elementId,
  title,
  description,
  position = 'bottom',
  onNext,
  onPrevious,
  onClose,
  isLast = false,
  isFirst = false,
  tourType,
}) => {
  const [targetElement, setTargetElement] = useState<Element | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  
  // Find and track the target element
  useEffect(() => {
    const findTargetElement = () => {
      let element: Element | null = null;
      
      if (elementId) {
        element = document.getElementById(elementId);
      } else if (selector) {
        element = document.querySelector(selector);
      }
      
      // Check if we need to open the mobile menu
      const isMobileView = window.innerWidth < 768; // Matches the Tailwind md: breakpoint
      if (isMobileView) {
        // Check if the element is hidden in the mobile menu when collapsed
        // Look specifically for elements that should be in the navigation
        const isMobileNavItem = selector?.includes('navbar') || 
          selector?.includes('need-help-button') || 
          selector?.includes('billing-menu') || 
          selector?.includes('href=');
        
        // If element is not visible and should be in the nav menu on mobile
        if (isMobileNavItem && (!element || element.getBoundingClientRect().height === 0)) {
          console.log('Opening mobile menu to show tour element');
          // Find and click the menu toggle button
          const menuButton = document.querySelector('.md\\:hidden button');
          if (menuButton && menuButton instanceof HTMLElement) {
            menuButton.click();
            // Re-query the element after opening the menu
            setTimeout(() => {
              if (elementId) {
                element = document.getElementById(elementId);
              } else if (selector) {
                element = document.querySelector(selector);
              }
              
              if (element) {
                setTargetElement(element);
                const rect = element.getBoundingClientRect();
                setTargetRect(rect);
              }
            }, 300); // Wait for menu animation
          }
        }
      }
      
      if (element) {
        setTargetElement(element);
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
      } else {
        console.warn(`Target element not found: ${elementId || selector}`);
      }
    };

    findTargetElement();
    
    // Recalculate position on resize and scroll
    const handleResize = () => {
      if (targetElement) {
        setTargetRect(targetElement.getBoundingClientRect());
      } else {
        // If target becomes null (like when switching to mobile view), try to find it again
        findTargetElement();
      }
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [elementId, selector, targetElement]);

  // Position the tooltip
  const getTooltipStyle = () => {
    if (!targetRect) return {};
    
    const padding = 20; // Padding around the element
    const tooltipWidth = window.innerWidth < 768 ? window.innerWidth * 0.9 : 500; // Responsive width
    
    switch (position) {
      case 'top':
        // Calculate centered position but keep within screen bounds
        const topCenterLeft = targetRect.left + (targetRect.width / 2);
        const topMaxLeft = window.innerWidth - tooltipWidth - 20; // 20px margin from right edge
        const topMinLeft = 20; // 20px margin from left edge
        const topFinalLeft = Math.max(topMinLeft, Math.min(topCenterLeft, topMaxLeft));
        
        return {
          bottom: `${window.innerHeight - targetRect.top + padding}px`,
          left: `${topFinalLeft}px`,
          transform: topFinalLeft === topCenterLeft ? 'translateX(-50%)' : 'none',
        };
      case 'bottom':
        // Calculate centered position but keep within screen bounds  
        const bottomCenterLeft = targetRect.left + (targetRect.width / 2);
        const bottomMaxLeft = window.innerWidth - tooltipWidth - 20; // 20px margin from right edge
        const bottomMinLeft = 20; // 20px margin from left edge
        const bottomFinalLeft = Math.max(bottomMinLeft, Math.min(bottomCenterLeft, bottomMaxLeft));
        
        return {
          top: `${targetRect.bottom + padding}px`,
          left: `${bottomFinalLeft}px`,
          transform: bottomFinalLeft === bottomCenterLeft ? 'translateX(-50%)' : 'none',
        };
      case 'left':
        // For left positioning, position tooltip to the left of the target element
        const minRightMargin = 20; // Minimum margin from right edge
        const targetLeftEdge = targetRect.left - padding;
        
        // Calculate how much space we need for the tooltip
        const spaceNeededFromRight = window.innerWidth - targetLeftEdge;
        const maxAllowedRight = window.innerWidth - tooltipWidth - minRightMargin;
        
        // Position the tooltip to the left of the target, but ensure it stays on screen
        const finalRight = Math.min(spaceNeededFromRight, maxAllowedRight);
        
        return {
          top: `${targetRect.top + (targetRect.height / 2)}px`,
          right: `${Math.max(finalRight, minRightMargin)}px`,
          transform: 'translateY(-50%)',
        };
      case 'right':
        // Calculate position to ensure tooltip stays on screen
        let leftPosition = targetRect.right + padding;
        const maxLeft = window.innerWidth - tooltipWidth - 20; // 20px margin from edge
        
        // If positioning to the right would push tooltip off screen, position it to the left instead
        if (leftPosition + tooltipWidth > window.innerWidth - 20) {
          leftPosition = targetRect.left - tooltipWidth - padding;
          // Ensure it doesn't go off the left edge
          leftPosition = Math.max(leftPosition, 20);
        }
        
        return {
          top: `${targetRect.bottom + 10}px`, // Slightly below the button instead of centered
          left: `${leftPosition}px`,
          transform: 'none', // No transform needed
        };
      case 'center':
        // Center the tooltip on the screen
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
      default:
        // Default fallback uses bottom positioning with boundary checks
        const defaultCenterLeft = targetRect.left + (targetRect.width / 2);
        const defaultMaxLeft = window.innerWidth - tooltipWidth - 20;
        const defaultMinLeft = 20;
        const defaultFinalLeft = Math.max(defaultMinLeft, Math.min(defaultCenterLeft, defaultMaxLeft));
        
        return {
          top: `${targetRect.bottom + padding}px`,
          left: `${defaultFinalLeft}px`,
          transform: defaultFinalLeft === defaultCenterLeft ? 'translateX(-50%)' : 'none',
        };
    }
  };

  // Create the highlight cutout effect
  const getHighlightStyle = () => {
    if (!targetRect) return {};
    
    const padding = 8; // Padding around the highlight
    
    return {
      top: `${targetRect.top - padding}px`,
      left: `${targetRect.left - padding}px`,
      width: `${targetRect.width + (padding * 2)}px`,
      height: `${targetRect.height + (padding * 2)}px`,
      borderRadius: '4px',
      border: '2px solid #3b82f6',
      zIndex: 10000
    };
  };

  // Don't render if there's no target, unless it's center position (which doesn't need a target)
  if ((!targetElement || !targetRect) && position !== 'center') {
    return null;
  }

  // Use portal to render the overlay at the document root
  return createPortal(
    <div className="tour-overlay" ref={overlayRef}>
      {/* Conditional overlay behavior based on tour type */}
      {tourType === 'appointment_booking_tour' ? (
        // For appointment booking tour: non-blocking overlay that allows interactions
        <div 
          className="fixed inset-0 pointer-events-none z-[9999]"
        />
      ) : (
        // For quick tour: blocking overlay
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-[9999]"
          onClick={onClose}
        />
      )}
      
      {/* Highlight focus area - only show if we have a target and it's not center position */}
      {targetElement && targetRect && position !== 'center' && (
        <div
          ref={highlightRef}
          className="absolute z-[10000]"
          style={{
            ...getHighlightStyle(),
            animation: 'pulse 2s infinite',
          }}
        />
      )}
      
      {/* Tooltip */}
      <div 
        className="fixed bg-white p-4 rounded-lg shadow-xl z-[10001] max-w-md w-[90%] md:w-[500px]"
        style={{
          ...getTooltipStyle(),
          animation: 'fadeIn 0.3s ease-in-out',
        }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-700 mb-4">{description}</p>
        
        <div className="flex justify-between">
          <div>
            {!isFirst && (
              <button
                onClick={onPrevious}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded mr-2 hover:bg-gray-300 transition"
              >
                Previous
              </button>
            )}
          </div>
          
          <div>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition mr-2"
              aria-label="Exit Tour"
              data-testid="exit-tour-button"
            >
              Exit Tour
            </button>
            {isLast ? (
              <button
                onClick={onClose}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Finish Tour
              </button>
            ) : (
              <button
                onClick={onNext}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes pulse {
          0% { 
            border-color: rgba(59, 130, 246, 1);
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
          }
          70% { 
            border-color: rgba(59, 130, 246, 0.8);
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% { 
            border-color: rgba(59, 130, 246, 1);
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
      `}</style>
    </div>,
    document.body
  );
};