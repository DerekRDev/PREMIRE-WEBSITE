import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-neutral-50 to-neutral-100 border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:pr-6">
            <div className="flex items-center mb-5">
              <div className="relative h-28 w-80">
                <Image 
                  src="/images/premier-logo-final-refinements.svg" 
                  alt="Premier Healthcare Logo" 
                  fill
                  className="object-contain"
                  style={{ objectPosition: 'left center' }}
                />
              </div>
            </div>
            <p className="text-neutral-600 mt-3 leading-relaxed">
              Providing high-quality healthcare services to our community, with a focus on patient experience and outcomes.
            </p>
            
            <div className="mt-6 flex space-x-5">
              <a href="#" className="text-neutral-400 hover:text-[#1877F2] transition-colors duration-300" aria-label="Facebook">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-[#1DA1F2] transition-colors duration-300" aria-label="Twitter">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-[#0A66C2] transition-colors duration-300" aria-label="LinkedIn">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="md:border-l md:border-neutral-200 md:pl-8">
            <h3 className="text-[#007f3d] font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-neutral-600 hover:text-[#007f3d] transition-colors duration-200 flex items-center">
                  <span className="text-[#f7941d] mr-2">›</span>Home
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="text-neutral-600 hover:text-[#007f3d] transition-colors duration-200 flex items-center">
                  <span className="text-[#f7941d] mr-2">›</span>Schedule an Appointment
                </Link>
              </li>
              <li>
                <Link href="/intake?patientId=demopatient123" className="text-neutral-600 hover:text-[#007f3d] transition-colors duration-200 flex items-center">
                  <span className="text-[#f7941d] mr-2">›</span>Patient Intake
                </Link>
              </li>
              <li>
                <Link href="/referrals" className="text-neutral-600 hover:text-[#007f3d] transition-colors duration-200 flex items-center">
                  <span className="text-[#f7941d] mr-2">›</span>Referrals
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="md:border-l md:border-neutral-200 md:pl-8">
            <h3 className="text-[#007f3d] font-medium text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/patient/resources" className="text-neutral-600 hover:text-[#007f3d] transition-colors duration-200 flex items-center">
                  <span className="text-[#f7941d] mr-2">›</span>Patient Resources
                </Link>
              </li>
              <li>
                <Link href="/insurance" className="text-neutral-600 hover:text-[#007f3d] transition-colors duration-200 flex items-center">
                  <span className="text-[#f7941d] mr-2">›</span>Insurance Information
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-neutral-600 hover:text-[#007f3d] transition-colors duration-200 flex items-center">
                  <span className="text-[#f7941d] mr-2">›</span>Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-600 hover:text-[#007f3d] transition-colors duration-200 flex items-center">
                  <span className="text-[#f7941d] mr-2">›</span>Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="md:border-l md:border-neutral-200 md:pl-8">
            <h3 className="text-[#007f3d] font-medium text-lg mb-4">Contact</h3>
            <address className="text-neutral-600 not-italic leading-relaxed">
              123 Main St<br />
              Pasco County, FL<br />
              <a href="tel:+15551234567" className="hover:text-[#007f3d] transition-colors duration-200">(555) 123-4567</a><br />
              <a href="mailto:info@premier-healthcare.com" className="hover:text-[#007f3d] transition-colors duration-200">info@premier-healthcare.com</a>
            </address>
            <div className="mt-5">
              <Link href="/contact" className="inline-flex items-center text-[#007f3d] hover:text-[#006c34] transition-colors duration-200 font-medium">
                Contact Us <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-neutral-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-500 mb-4 md:mb-0">
              © {currentYear} Premier Healthcare. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <Link href="/privacy" className="text-neutral-500 hover:text-[#007f3d] transition-colors duration-200">
                Privacy
              </Link>
              <Link href="/terms" className="text-neutral-500 hover:text-[#007f3d] transition-colors duration-200">
                Terms
              </Link>
              <Link href="/accessibility" className="text-neutral-500 hover:text-[#007f3d] transition-colors duration-200">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};