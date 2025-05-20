'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import react-confetti to avoid SSR issues
const ReactConfetti = dynamic(() => import('react-confetti'), { 
  ssr: false 
});

interface ConfettiEffectProps {
  duration?: number;
  onComplete?: () => void;
}

/**
 * A component that displays a confetti animation
 * Automatically removes itself after the specified duration
 */
export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ 
  duration = 5000, 
  onComplete 
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isActive, setIsActive] = useState(true);

  // Set window dimensions immediately and on resize
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Force immediate setting of dimensions
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      console.log('🎊 Confetti initialized with dimensions:', window.innerWidth, window.innerHeight);

      const handleResize = () => {
        const newDimensions = {
          width: window.innerWidth,
          height: window.innerHeight
        };
        console.log('🎊 Confetti dimensions updated:', newDimensions);
        setDimensions(newDimensions);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Set a timer to remove the confetti after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(false);
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isActive || dimensions.width === 0) {
    return null;
  }

  console.log('🎊 Rendering confetti with dimensions:', dimensions.width, dimensions.height);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[10001]">
      <ReactConfetti
        width={dimensions.width}
        height={dimensions.height}
        recycle={false}
        numberOfPieces={1000}
        gravity={0.3}
        wind={0.01}
        initialVelocityY={15}
        tweenDuration={2000}
        colors={['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#ffeb3b', '#ff9800']}
      />
    </div>
  );
};