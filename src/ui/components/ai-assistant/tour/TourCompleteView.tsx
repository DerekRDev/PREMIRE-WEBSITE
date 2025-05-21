/**
 * TourCompleteView
 * Component that displays the tour completion celebration with confetti
 */
import React from 'react';
import dynamic from 'next/dynamic';

const ReactConfetti = dynamic(() => import('react-confetti'), { ssr: false });

interface TourCompleteViewProps {
  onClose: () => void;
}

export const TourCompleteView: React.FC<TourCompleteViewProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[12000] flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative z-[12001] bg-white p-8 rounded-xl shadow-2xl max-w-md w-11/12 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <ReactConfetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={1000}
            gravity={0.3}
          />
        </div>
        <div className="text-5xl mb-6">🎉</div>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Tour Complete!</h2>
        <p className="text-gray-700 mb-8">
          Congratulations! You've completed the quick tour of Premier Healthcare. 
          Feel free to explore the platform on your own.
        </p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
            aria-label="Continue"
            data-testid="tour-complete-continue"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};