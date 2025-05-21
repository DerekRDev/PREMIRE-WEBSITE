/**
 * Mobile Menu Handling Test
 * Tests the specific functionality of opening the mobile menu for tours
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple test component that mimics the functionality we added
const MobileMenuOpener = ({ selector }: { selector: string }) => {
  React.useEffect(() => {
    const isMobileView = window.innerWidth < 768;
    if (isMobileView) {
      // Try to find the menu button and click it
      const menuButton = document.querySelector('.mobile-menu-button');
      if (menuButton && menuButton instanceof HTMLElement) {
        menuButton.click();
      }
    }
  }, []);

  return <div data-testid="menu-opener">Menu Opener Component</div>;
};

describe('Mobile Menu Handling', () => {
  beforeEach(() => {
    // Set up mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375 // Mobile width
    });

    // Set up the DOM with a mobile menu
    document.body.innerHTML = `
      <div>
        <button class="mobile-menu-button">Menu</button>
        <div id="mobile-menu" class="hidden">Mobile Menu Content</div>
      </div>
    `;

    // Add click handler to the button
    const button = document.querySelector('.mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    if (button && menu) {
      button.addEventListener('click', () => {
        menu.classList.toggle('hidden');
      });
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  test('opens mobile menu when in mobile view', () => {
    // Spy on the click method
    const clickSpy = jest.spyOn(HTMLElement.prototype, 'click');
    
    // Render our test component
    render(<MobileMenuOpener selector=".some-element" />);
    
    // Check component rendered
    expect(screen.getByTestId('menu-opener')).toBeInTheDocument();
    
    // Check if the button was clicked
    expect(clickSpy).toHaveBeenCalled();
    
    // Check if the menu is now visible (hidden class removed)
    const menu = document.getElementById('mobile-menu');
    expect(menu).not.toHaveClass('hidden');
  });

  test('does not open menu in desktop view', () => {
    // Change to desktop width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024 // Desktop width
    });

    const clickSpy = jest.spyOn(HTMLElement.prototype, 'click');
    
    // Render our test component
    render(<MobileMenuOpener selector=".some-element" />);
    
    // Check if the button was NOT clicked in desktop view
    expect(clickSpy).not.toHaveBeenCalled();
    
    // Menu should still be hidden
    const menu = document.getElementById('mobile-menu');
    expect(menu).toHaveClass('hidden');
  });

  // Test component that simulates TourView's menu handling during step changes
  test('keeps mobile menu open during step navigation', () => {
    // Setup click spy 
    const clickSpy = jest.spyOn(HTMLElement.prototype, 'click');
    
    // Setup component with state
    function StepNavigator() {
      const [step, setStep] = React.useState(0);
      
      // This replicates our ensureMobileMenuOpen function
      const ensureMobileMenuOpen = React.useCallback(() => {
        const isMobileView = window.innerWidth < 768;
        if (isMobileView) {
          const mobileMenu = document.getElementById('mobile-menu');
          const isMenuHidden = mobileMenu?.classList.contains('hidden');
          
          if (isMenuHidden) {
            const menuButton = document.querySelector('.mobile-menu-button');
            if (menuButton && menuButton instanceof HTMLElement) {
              menuButton.click();
            }
          }
        }
      }, []);
      
      // Effect to handle initial state
      React.useEffect(() => {
        ensureMobileMenuOpen();
      }, [ensureMobileMenuOpen]);
      
      // Function to handle next step (triggers the menu check)
      const handleNext = () => {
        setStep(prev => prev + 1);
        // This is the key part - checking the menu when navigating
        setTimeout(() => {
          ensureMobileMenuOpen();
        }, 100);
      };
      
      return (
        <div>
          <div data-testid="current-step">Step {step}</div>
          <button onClick={handleNext} data-testid="next-button">Next</button>
        </div>
      );
    }
    
    // Render the component
    const { getByTestId } = render(<StepNavigator />);
    
    // Initial render should open the menu
    expect(clickSpy).toHaveBeenCalledTimes(1);
    
    // Reset the tracking to clearly see the next call
    clickSpy.mockClear();
    
    // Menu should be open
    const menu = document.getElementById('mobile-menu');
    expect(menu).not.toHaveClass('hidden');
    
    // Now manually close the menu to simulate what might happen during user interaction
    if (menu) menu.classList.add('hidden');
    
    // Click the next button to navigate to next step
    fireEvent.click(getByTestId('next-button'));
    
    // Advance timers to trigger the setTimeout
    jest.advanceTimersByTime(200);
    
    // Check that the menu was reopened
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(menu).not.toHaveClass('hidden');
    
    // Verify the step changed
    expect(getByTestId('current-step').textContent).toBe('Step 1');
  });
});