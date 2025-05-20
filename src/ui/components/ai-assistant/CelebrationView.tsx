"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/ui/design-system/components';
import { Choice } from '@/core/ai/WorkflowTypes';

interface CelebrationViewProps {
  text: string;
  choices?: Choice[];
  onChoiceSelected: (choiceId: string) => void;
  onClose: () => void;
}

export const CelebrationView: React.FC<CelebrationViewProps> = ({
  text,
  choices = [],
  onChoiceSelected,
  onClose,
}) => {
  const [isAnimating, setIsAnimating] = useState(true);
  
  // Generate random confetti pieces
  const createConfetti = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -(Math.random() * 20 + 10),
      size: Math.random() * 6 + 4,
      rotation: Math.random() * 360,
      color: ['#FFC700', '#FF0000', '#2E3191', '#41BBC7', '#31D843'][Math.floor(Math.random() * 5)],
      delay: Math.random() * 3,
      speed: 2 + Math.random() * 3,
    }));
  };

  const [confetti, setConfetti] = useState(createConfetti(40));

  // Animation effect
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setConfetti(prev => 
        prev.map(piece => ({
          ...piece,
          y: piece.y + piece.speed,
          rotation: piece.rotation + 2,
        })).filter(piece => piece.y < 120) // Remove pieces that have fallen out of view
      );
      
      // If there are too few pieces, add more
      if (confetti.length < 15) {
        setConfetti(prev => [...prev, ...createConfetti(10)]);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [confetti, isAnimating]);

  // Stop animation after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 6000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative p-8 bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Confetti overlay */}
      <div className="absolute inset-0 overflow-hidden">
        {isAnimating && confetti.map(piece => (
          <div
            key={piece.id}
            className="absolute"
            style={{
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              width: `${piece.size}px`,
              height: `${piece.size * 3}px`,
              backgroundColor: piece.color,
              transform: `rotate(${piece.rotation}deg)`,
              opacity: 0.8,
              transition: 'top 0.5s linear, transform 0.5s linear',
              animationDelay: `${piece.delay}s`,
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>
        
        <h2 className="text-xl font-bold mb-4 text-center">{text}</h2>
        
        <div className="mt-6 flex flex-col space-y-2">
          {choices.map(choice => (
            <Button
              key={choice.id}
              onClick={() => onChoiceSelected(choice.id)}
              className="w-full justify-center"
            >
              {choice.text}
            </Button>
          ))}
          
          {!choices.length && (
            <Button
              onClick={onClose}
              className="w-full justify-center"
            >
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};