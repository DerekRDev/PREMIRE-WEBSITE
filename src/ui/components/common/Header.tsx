import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  
  // Define navigation links
  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/appointments', label: 'Appointments' },
    { href: '/intake?patientId=demopatient123', label: 'Patient Intake' }, // Added demo patient ID
    { href: '/patient', label: 'My Profile' },
    { href: '/referrals', label: 'Referrals' },
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
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-blue-600 font-bold text-xl">
                Premier Healthcare
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav id="navbar" className="hidden md:flex space-x-6 items-center">
            {navigationLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === link.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                } ${link.href === '/appointments' ? 'appointment-section' : ''} ${link.href === '/intake' ? 'patient-intake-section' : ''}`}
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
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
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
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link
              href="/help"
              className="need-help-button ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Need Help?
            </Link>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50"
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
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
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
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
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
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
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
          
          <Link
            href="/help"
            className="need-help-button block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Need Help?
          </Link>
        </div>
      </div>
    </header>
  );
};