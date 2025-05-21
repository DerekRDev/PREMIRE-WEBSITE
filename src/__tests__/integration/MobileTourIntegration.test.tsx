/**
 * Mobile Tour Integration Tests
 * Tests the complete guided tour experience in mobile view,
 * specifically focusing on the hamburger menu interactions.
 */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TourView } from '@/ui/components/ai-assistant/TourView';
import { TourHighlight } from '@/ui/components/ai-assistant/TourHighlight';
import { TourAudioService } from '@/services/TourAudioService';
import { TourInteractionManager } from '@/services/TourInteractionManager';

// Mock the services
jest.mock('@/services/TourAudioService', () => ({
  TourAudioService: {
    getInstance: jest.fn(() => ({
      playStepAudio: jest.fn(),
      stopAudio: jest.fn(),
      reset: jest.fn(),
      setAssistantVisible: jest.fn()
    }))
  }
}));

jest.mock('@/services/TourInteractionManager', () => ({
  TourInteractionManager: {
    getInstance: jest.fn(() => ({
      handleNextStep: jest.fn((currentId, nextId, callback, nextIndex) => {
        callback(nextIndex);
      }),
      handlePreviousStep: jest.fn((currentId, callback, prevIndex) => {
        callback(prevIndex);
      }),
      handleTourComplete: jest.fn(callback => callback()),
      handleCloseTour: jest.fn(callback => callback())
    }))
  }
}));

// Mock createPortal
jest.mock('react-dom', () => {
  const originalModule = jest.requireActual('react-dom');
  return {
    ...originalModule,
    createPortal: (node: React.ReactNode) => node,
  };
});

describe('Mobile Tour Integration', () => {
  // Configuration from tours.yaml (simplified version)
  const tourSteps = [
    {
      id: 'navigation_overview',
      title: 'Navigation',
      description: 'Use the navigation bar to move between different sections.',
      selector: 'nav#navbar',
      position: 'bottom',
      audioFile: 'tour/audio1.mp3'
    },
    {
      id: 'appointments_overview',
      title: 'Appointment Scheduling',
      description: 'Schedule and manage your appointments.',
      selector: 'a[href="/appointments"]',
      position: 'bottom',
      audioFile: 'tour/audio2.mp3'
    },
    {
      id: 'intake_overview',
      title: 'Patient Intake',
      description: 'Fill out your medical information.',
      selector: 'a[href="/intake"]',
      position: 'bottom',
      audioFile: 'tour/audio3.mp3'
    }
  ];

  beforeEach(() => {
    // Set up mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375 // iPhone width
    });

    // Create mobile header structure
    document.body.innerHTML = `
      <header class="header-container">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between h-16">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <a href="/" class="text-blue-600 font-bold text-xl">Premier Healthcare</a>
            </div>
            
            <!-- Desktop Navigation (hidden on mobile) -->
            <nav id="navbar" class="hidden md:flex space-x-6 items-center">
              <a href="/" class="text-gray-600">Home</a>
              <a href="/appointments" class="text-gray-600 appointment-section">Appointments</a>
              <a href="/intake" class="text-gray-600 patient-intake-section">Patient Intake</a>
              <div id="billing-menu">
                <button>Billing & Insurance</button>
              </div>
              <a href="/help" class="need-help-button">Need Help?</a>
            </nav>
            
            <!-- Mobile menu button -->
            <div class="md:hidden flex items-center">
              <button
                id="mobile-menu-button"
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-400"
              >
                <span class="sr-only">Open main menu</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile menu (hidden by default) -->
        <div id="mobile-menu" class="md:hidden hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" class="text-gray-600 block px-3 py-2">Home</a>
            <a href="/appointments" class="text-gray-600 appointment-section block px-3 py-2">Appointments</a>
            <a href="/intake" class="text-gray-600 patient-intake-section block px-3 py-2">Patient Intake</a>
            <button id="mobile-billing-dropdown" class="text-gray-600 block px-3 py-2">Billing & Insurance</button>
            <a href="/help" class="need-help-button block px-3 py-2">Need Help?</a>
          </div>
        </div>
      </header>
    `;

    // Create the toggle behavior for the mobile menu
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuButton && mobileMenu) {
      menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    // Mock getBoundingClientRect to return zero height for hidden elements
    Element.prototype.getBoundingClientRect = jest.fn().mockImplementation(function() {
      const isHidden = this.closest('.hidden');
      // For elements in hidden containers, return zero height
      if (isHidden) {
        return { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 };
      }
      return { top: 100, left: 100, right: 200, bottom: 150, width: 100, height: 50 };
    });

    // Spy on the menu button click
    jest.spyOn(HTMLElement.prototype, 'click');
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  test('should automatically open mobile menu when tour starts', async () => {
    // Verify mobile menu is initially closed
    const mobileMenu = document.getElementById('mobile-menu');
    expect(mobileMenu?.classList.contains('hidden')).toBe(true);
    
    // Render the tour view
    render(
      <TourView
        steps={tourSteps}
        currentStepIndex={0}
        onClose={jest.fn()}
        onComplete={jest.fn()}
      />
    );
    
    // Wait for component to initialize and handle the menu
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
    });
    
    // Expect the menu button to have been clicked
    const menuButton = document.getElementById('mobile-menu-button');
    expect(menuButton?.click).toHaveBeenCalled();
  });

  test('should keep menu open when navigating between tour steps', async () => {
    // Render the tour starting at the first step
    const { getByText } = render(
      <TourView
        steps={tourSteps}
        currentStepIndex={0}
        onClose={jest.fn()}
        onComplete={jest.fn()}
      />
    );
    
    // Wait for initialization
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
    });
    
    // Reset click tracking
    (HTMLElement.prototype.click as jest.Mock).mockClear();
    
    // Find and click the Next button
    fireEvent.click(getByText('Next'));
    
    // Wait for step change to process
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
    });
    
    // Should still check if the menu is open after step change
    expect(document.querySelector).toHaveBeenCalledWith('.md\\:hidden .px-2.pt-2.pb-3');
  });

  test('should complete full tour navigation in mobile view', async () => {
    // This tests the complete flow through all steps
    const onCompleteMock = jest.fn();
    
    const { getByText, rerender } = render(
      <TourView
        steps={tourSteps}
        currentStepIndex={0}
        onClose={jest.fn()}
        onComplete={onCompleteMock}
      />
    );
    
    // First step should show Navigation title
    expect(getByText('Navigation')).toBeInTheDocument();
    
    // Navigate to step 2
    fireEvent.click(getByText('Next'));
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });
    
    // Update component to reflect the step change
    rerender(
      <TourView
        steps={tourSteps}
        currentStepIndex={1}
        onClose={jest.fn()}
        onComplete={onCompleteMock}
      />
    );
    
    // Second step should show Appointment Scheduling
    expect(getByText('Appointment Scheduling')).toBeInTheDocument();
    
    // Navigate to step 3
    fireEvent.click(getByText('Next'));
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });
    
    // Update component to reflect the step change
    rerender(
      <TourView
        steps={tourSteps}
        currentStepIndex={2}
        onClose={jest.fn()}
        onComplete={onCompleteMock}
      />
    );
    
    // Third step should show Patient Intake
    expect(getByText('Patient Intake')).toBeInTheDocument();
    
    // On last step, should show Finish Tour instead of Next
    expect(getByText('Finish Tour')).toBeInTheDocument();
    
    // Complete the tour
    fireEvent.click(getByText('Finish Tour'));
    
    // Verify completion was called
    expect(onCompleteMock).toHaveBeenCalled();
  });

  // Additional test to verify TourHighlight's direct hamburger menu interaction
  test('TourHighlight should directly handle mobile menu for hidden elements', async () => {
    // Reset the mobile menu to hidden state
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) mobileMenu.classList.add('hidden');
    
    // Reset click tracking
    (HTMLElement.prototype.click as jest.Mock).mockClear();
    
    // Render just the TourHighlight component targeting an element in the mobile menu
    render(
      <TourHighlight
        selector=".patient-intake-section"
        title="Patient Intake"
        description="Test description"
        onNext={jest.fn()}
        onPrevious={jest.fn()}
        onClose={jest.fn()}
      />
    );
    
    // Wait for component to detect and handle the hidden element
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
    });
    
    // Verify the menu button was clicked to show the target element
    const menuButton = document.getElementById('mobile-menu-button');
    expect(menuButton?.click).toHaveBeenCalled();
  });
});