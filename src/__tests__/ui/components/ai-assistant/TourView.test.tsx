/**
 * TourView component tests
 * Tests the tour functionality with focus on mobile interactions
 */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { TourView } from '@/ui/components/ai-assistant/TourView';
import '@testing-library/jest-dom';
import { TourAudioService } from '@/services/TourAudioService';
import { TourInteractionManager } from '@/services/TourInteractionManager';

// Mock dependencies
jest.mock('@/services/TourAudioService', () => ({
  TourAudioService: {
    getInstance: jest.fn(() => ({
      playStepAudio: jest.fn(),
      stopAudio: jest.fn(),
      reset: jest.fn()
    }))
  }
}));

jest.mock('@/services/TourInteractionManager', () => ({
  TourInteractionManager: {
    getInstance: jest.fn(() => ({
      handleNextStep: jest.fn((currentId, nextId, callback) => {
        // Call the callback to simulate step change
        callback(1);
      }),
      handlePreviousStep: jest.fn((currentId, callback) => {
        // Call the callback to simulate step change
        callback(0);
      }),
      handleTourComplete: jest.fn((callback) => {
        callback();
      }),
      handleCloseTour: jest.fn((callback) => {
        callback();
      })
    }))
  }
}));

// Mock createPortal to work with testing
jest.mock('react-dom', () => {
  const originalModule = jest.requireActual('react-dom');
  return {
    ...originalModule,
    createPortal: (node: React.ReactNode) => node,
  };
});

describe('TourView Component in Mobile Environment', () => {
  // Sample tour steps for testing
  const mockTourSteps = [
    {
      id: 'step1',
      title: 'Navigation',
      description: 'Use the navigation bar to move between different sections.',
      selector: '.nav-item',
      audioFile: 'test-audio.mp3'
    },
    {
      id: 'step2',
      title: 'Appointments',
      description: 'Schedule and manage your appointments.',
      selector: '.appointment-section',
      audioFile: 'test-audio.mp3'
    },
    {
      id: 'step3',
      title: 'Patient Intake',
      description: 'Fill out your medical information.',
      selector: '.patient-intake-section',
      audioFile: 'test-audio.mp3'
    }
  ];

  beforeEach(() => {
    // Set up mobile view environment
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375 // iPhone size
    });

    // Create mobile menu DOM structure
    const header = document.createElement('header');
    header.innerHTML = `
      <div class="max-w-7xl mx-auto px-4">
        <div class="md:hidden flex items-center">
          <button
            class="mobile-menu-button"
            aria-expanded="false"
          >
            Menu
          </button>
        </div>
        
        <nav id="navbar" class="hidden md:flex">
          <a href="/" class="nav-item">Home</a>
          <a href="/appointments" class="appointment-section">Appointments</a>
          <a href="/intake" class="patient-intake-section">Patient Intake</a>
        </nav>
      </div>

      <!-- Mobile menu (hidden by default) -->
      <div class="md:hidden px-2 pt-2 pb-3 hidden">
        <a href="/" class="nav-item">Home</a>
        <a href="/appointments" class="appointment-section">Appointments</a>
        <a href="/intake" class="patient-intake-section">Patient Intake</a>
      </div>
    `;
    document.body.appendChild(header);

    // Mock the menu open/close behavior
    const menuButton = document.querySelector('.mobile-menu-button');
    if (menuButton) {
      menuButton.addEventListener('click', () => {
        const mobileMenu = document.querySelector('.md\\:hidden.px-2');
        if (mobileMenu) {
          if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
          } else {
            mobileMenu.classList.add('hidden');
          }
        }
      });
    }

    // Mock element.getBoundingClientRect
    Element.prototype.getBoundingClientRect = jest.fn().mockImplementation(function() {
      const isHidden = this.closest('.hidden');
      // Return zero height for hidden elements, realistic values for visible ones
      return isHidden ? 
        { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 } :
        { top: 100, left: 100, right: 200, bottom: 150, width: 100, height: 50 };
    });

    // Spy on querySelector to track element selection attempts
    jest.spyOn(document, 'querySelector');
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  test('should ensure mobile menu is open when initializing tour', async () => {
    // Create spy for menu button click
    const menuButtonClickSpy = jest.spyOn(HTMLElement.prototype, 'click');
    
    // Render TourView component
    render(
      <TourView
        steps={mockTourSteps}
        currentStepIndex={0}
        onClose={jest.fn()}
        onComplete={jest.fn()}
        onStepChange={jest.fn()}
      />
    );

    // Wait for initialization effects to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    // Check if ensureMobileMenuOpen tried to interact with the menu button
    expect(document.querySelector).toHaveBeenCalledWith('.md\\:hidden button');
    expect(menuButtonClickSpy).toHaveBeenCalled();
  });

  test('should keep mobile menu open when navigating between steps', async () => {
    // Spy on the menu button clicks
    const menuButtonClickSpy = jest.spyOn(HTMLElement.prototype, 'click');
    const onStepChangeMock = jest.fn();
    
    const { getByText } = render(
      <TourView
        steps={mockTourSteps}
        currentStepIndex={0}
        onClose={jest.fn()}
        onComplete={jest.fn()}
        onStepChange={onStepChangeMock}
      />
    );

    // Initial render should try to open menu
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });
    
    // Reset the spy count
    menuButtonClickSpy.mockClear();
    
    // Click Next button to navigate to next step
    fireEvent.click(getByText('Next'));

    // Wait for step change and effects
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    // Verify the step change was requested
    expect(onStepChangeMock).toHaveBeenCalled();
    
    // Verify the menu was checked again after step change
    expect(document.querySelector).toHaveBeenCalledWith('.md\\:hidden .px-2.pt-2.pb-3');
  });

  test('should handle tour completion in mobile view', async () => {
    const onCompleteMock = jest.fn();
    
    // Start with last step
    const { getByText } = render(
      <TourView
        steps={mockTourSteps}
        currentStepIndex={mockTourSteps.length - 1}
        onClose={jest.fn()}
        onComplete={onCompleteMock}
      />
    );

    // Wait for initialization
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });
    
    // Click Finish Tour button (on last step)
    fireEvent.click(getByText('Finish Tour'));
    
    // Verify completion handler was called
    expect(onCompleteMock).toHaveBeenCalled();
    
    // Verify audio was stopped (called via the TourInteractionManager)
    expect(TourAudioService.getInstance().stopAudio).toHaveBeenCalled();
  });

  test('should handle early tour exit in mobile view', async () => {
    const onCloseMock = jest.fn();
    
    const { getByText } = render(
      <TourView
        steps={mockTourSteps}
        currentStepIndex={0}
        onClose={onCloseMock}
        onComplete={jest.fn()}
      />
    );

    // Wait for initialization
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });
    
    // Click Exit Tour button
    fireEvent.click(getByText('Exit Tour'));
    
    // Verify close handler was called
    expect(onCloseMock).toHaveBeenCalled();
    
    // Verify audio was stopped and reset
    expect(TourAudioService.getInstance().stopAudio).toHaveBeenCalled();
  });
});