import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { NavbarAIButton } from '@/ui/components/ai-assistant';

// Create a context for menu control
export const MenuContext = React.createContext<{
  setIsMenuOpen: (isOpen: boolean) => void;
}>({ setIsMenuOpen: () => {} });

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  
  // Define navigation links
  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/appointments', label: 'Appointments', className: 'appointment-section' },
    { href: '/intake', label: 'Patient Intake', className: 'patient-intake-section' },
    { href: '/patient', label: 'My Profile', className: 'profile-section' },
    { href: '/referrals', label: 'Referrals', className: 'referrals-section' },
  ];
  
  // Define dropdown menu items
  const patientMenuItems = [
    { href: '/payments', label: 'Make a Payment' },
    { href: '/financial-assistance', label: 'Financial Assistance' },
    { href: '/insurance/add', label: 'Add Insurance' },
    { href: '/cost-estimate', label: 'Cost Estimator' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <MenuContext.Provider value={{ setIsMenuOpen }}>
      <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <div className="relative h-20 w-80 sm:w-96">
                <Image 
                  src="/images/premier-logo-final-refinements.svg" 
                  alt="Premier Healthcare Logo" 
                  fill
                  className="object-contain"
                  priority
                  style={{ objectPosition: 'left center' }}
                />
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav id="navbar" className="hidden md:flex space-x-4 items-center ml-auto">
            {navigationLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === link.href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                } ${link.className || ''}`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Payment & Insurance Dropdown */}
            <div id="billing-menu" className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 ${
                  patientMenuItems.some(item => pathname === item.href)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <span>Billing & Insurance</span>
                <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  {patientMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-2 text-sm ${
                        pathname === item.href
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-700'
                      }`}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <div className="ml-4">
              <NavbarAIButton />
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-primary-600 hover:bg-primary-50"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu - hamburger when closed, X when open */}
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === link.href
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
              } ${link.className || ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          {/* Mobile Billing & Insurance Section */}
          <div className="mt-1">
            <button
              onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
              className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center justify-between ${
                patientMenuItems.some(item => pathname === item.href)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              <span>Billing & Insurance</span>
              <svg className={`w-4 h-4 transition-transform ${isMobileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Mobile Dropdown Menu */}
            {isMobileDropdownOpen && (
              <div className="pl-4 mt-1 space-y-1">
                {patientMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === item.href
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-700'
                    }`}
                    onClick={() => {
                      setIsMobileDropdownOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-3 flex justify-center" onClick={() => setIsMenuOpen(false)}>
            <NavbarAIButton />
          </div>
        </div>
      </div>
    </header>
    </MenuContext.Provider>
  );
};