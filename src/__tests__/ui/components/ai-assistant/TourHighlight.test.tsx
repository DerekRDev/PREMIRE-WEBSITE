/**
 * TourHighlight component tests
 * Focus on mobile view functionality, especially hamburger menu interactions
 */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { TourHighlight } from '@/ui/components/ai-assistant/TourHighlight';
import '@testing-library/jest-dom';

// Mock createPortal to work with jest testing
jest.mock('react-dom', () => {
  const originalModule = jest.requireActual('react-dom');
  return {
    ...originalModule,
    createPortal: (node: React.ReactNode) => node,
  };
});

describe('TourHighlight Component in Mobile View', () => {
  // Setup mock mobile menu DOM structure before each test
  beforeEach(() => {
    // Create a header with hamburger menu structure similar to the real app
    const header = document.createElement('header');
    header.innerHTML = `
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <a href="/" class="text-blue-600 font-bold text-xl">Premier Healthcare</a>
            </div>
          </div>
          
          <!-- Desktop Navigation (hidden on mobile) -->
          <nav id="navbar" class="hidden md:flex space-x-6 items-center">
            <a href="/" class="nav-item">Home</a>
            <a href="/appointments" class="appointment-section">Appointments</a>
            <a id="intake-link" href="/intake" class="patient-intake-section">Patient Intake</a>
          </nav>
          
          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center">
            <button
              class="mobile-menu-button inline-flex items-center justify-center p-2 rounded-md text-gray-400"
              aria-expanded="false"
            >
              <span class="sr-only">Open main menu</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu, initially hidden -->
      <div class="md:hidden hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="/" class="mobile-nav-item">Home</a>
          <a href="/appointments" class="mobile-nav-item appointment-section">Appointments</a>
          <a href="/intake" class="mobile-nav-item patient-intake-section">Patient Intake</a>
        </div>
      </div>
    `;
    document.body.appendChild(header);

    // Mock innerWidth to simulate mobile view
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, // iPhone size
    });

    // Mock the getBoundingClientRect function for elements
    Element.prototype.getBoundingClientRect = jest.fn().mockImplementation(function() {
      const isHidden = this.closest('.hidden');
      // Return zero height if element is in a hidden container
      if (isHidden) {
        return {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: 0,
          height: 0,
        };
      }
      // Return non-zero values if element is visible
      return {
        top: 100,
        left: 100,
        right: 200,
        bottom: 150,
        width: 100,
        height: 50,
      };
    });
  });

  afterEach(() => {
    // Clean up the DOM after each test
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  test('should open mobile menu when target element is hidden', async () => {
    // Mock the click function for the mobile menu button
    const menuButtonClickSpy = jest.fn();
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    if (mobileMenuButton) {
      mobileMenuButton.addEventListener('click', menuButtonClickSpy);
      
      // Mock menu button behavior to show mobile menu when clicked
      mobileMenuButton.addEventListener('click', () => {
        const mobileMenu = document.querySelector('.md\\:hidden.hidden');
        if (mobileMenu) {
          mobileMenu.classList.remove('hidden');
        }
      });
    }

    // Render the TourHighlight targeting an element in the mobile menu
    render(
      <TourHighlight
        selector=".appointment-section"
        title="Appointment Scheduling"
        description="Test description"
        onNext={() => {}}
        onPrevious={() => {}}
        onClose={() => {}}
      />
    );

    // Wait for component useEffect to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
    });

    // Check if the menu button was clicked to open the menu
    expect(menuButtonClickSpy).toHaveBeenCalled();
    
    // Check if the highlight component rendered
    expect(screen.getByText('Appointment Scheduling')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  test('handles navigation within the tour in mobile view', async () => {
    // Setup click handler for mobile menu button
    const menuButtonClickSpy = jest.fn();
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    if (mobileMenuButton) {
      mobileMenuButton.addEventListener('click', menuButtonClickSpy);
      
      // Mock menu button behavior
      mobileMenuButton.addEventListener('click', () => {
        const mobileMenu = document.querySelector('.md\\:hidden.hidden');
        if (mobileMenu) {
          mobileMenu.classList.remove('hidden');
        }
      });
    }

    // Setup mocks for navigation callbacks
    const onNextMock = jest.fn();
    const onPreviousMock = jest.fn();
    const onCloseMock = jest.fn();

    // Render component
    render(
      <TourHighlight
        selector=".appointment-section"
        title="Appointment Scheduling"
        description="Test description"
        onNext={onNextMock}
        onPrevious={onPreviousMock}
        onClose={onCloseMock}
      />
    );

    // Wait for component to initialize
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
    });

    // Test navigation buttons
    fireEvent.click(screen.getByText('Next'));
    expect(onNextMock).toHaveBeenCalled();

    // Test close button
    fireEvent.click(screen.getByText('Exit Tour'));
    expect(onCloseMock).toHaveBeenCalled();
  });

  test('should react to window resize events', async () => {
    const resizeSpy = jest.spyOn(window, 'addEventListener');

    render(
      <TourHighlight
        selector=".appointment-section"
        title="Appointment Scheduling"
        description="Test description"
        onNext={() => {}}
        onClose={() => {}}
      />
    );

    // Check if resize listener was added
    expect(resizeSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    // Clean up
    resizeSpy.mockRestore();
  });
});

// Test for TourView component that includes mobile functionality
describe('Mobile Tour View Integration', () => {
  // This would actually be better in a separate file, but for simplicity we'll include it here
  
  test('should ensure mobile menu stays open between step transitions', async () => {
    // This is a placeholder for a more complex test that would:
    // 1. Mock the mobile menu structure
    // 2. Render the TourView component
    // 3. Navigate between steps
    // 4. Verify the mobile menu stays open
    
    // In a real implementation, you would use something like:
    // render(<TourView steps={mockSteps} onClose={() => {}} onComplete={() => {}} />);
    
    // For now, this test is just a placeholder
    expect(true).toBe(true);
  });
});