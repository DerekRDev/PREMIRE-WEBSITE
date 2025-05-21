"use client";

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface TourHighlightProps {
  selector?: string;        // CSS selector for the element to highlight
  elementId?: string;       // ID of the element to highlight
  title: string;            // Title of the highlighted feature
  description: string;      // Description of the highlighted feature
  position?: 'top' | 'bottom' | 'left' | 'right'; // Position of the tooltip
  onNext?: () => void;      // Callback for next step
  onPrevious?: () => void;  // Callback for previous step
  onClose?: () => void;     // Callback for closing the tour
  isLast?: boolean;         // Is this the last step in the tour
  isFirst?: boolean;        // Is this the first step in the tour
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
    
    // For center positioning, use these styles regardless of position
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
    
    // Original position-based tooltip placement code kept for reference
    /* 
    const padding = 10; // Padding around the element
    
    switch (position) {
      case 'top':
        return {
          bottom: `${window.innerHeight - targetRect.top + padding}px`,
          left: `${targetRect.left + (targetRect.width / 2)}px`,
          transform: 'translateX(-50%)',
        };
      case 'bottom':
        return {
          top: `${targetRect.bottom + padding}px`,
          left: `${targetRect.left + (targetRect.width / 2)}px`,
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          top: `${targetRect.top + (targetRect.height / 2)}px`,
          right: `${window.innerWidth - targetRect.left + padding}px`,
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          top: `${targetRect.top + (targetRect.height / 2)}px`,
          left: `${targetRect.right + padding}px`,
          transform: 'translateY(-50%)',
        };
      default:
        return {
          top: `${targetRect.bottom + padding}px`,
          left: `${targetRect.left + (targetRect.width / 2)}px`,
          transform: 'translateX(-50%)',
        };
    }
    */
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
      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)',
      zIndex: 10000
    };
  };

  // Don't render if there's no target
  if (!targetElement || !targetRect) {
    return null;
  }

  // Use portal to render the overlay at the document root
  return createPortal(
    <div className="tour-overlay" ref={overlayRef}>
      {/* Removed overlay since we're using boxShadow for the cutout effect */}
      
      {/* Highlight focus area - using a cutout effect */}
      <div
        ref={highlightRef}
        className="absolute z-[10000]"
        style={{
          ...getHighlightStyle(),
          animation: 'pulse 2s infinite',
        }}
      />
      
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
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.75); 
          }
          70% { 
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0), 0 0 0 9999px rgba(0, 0, 0, 0.75); 
          }
          100% { 
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0), 0 0 0 9999px rgba(0, 0, 0, 0.75); 
          }
        }
      `}</style>
    </div>,
    document.body
  );
};