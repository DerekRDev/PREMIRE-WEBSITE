import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Premier Healthcare</h3>
            <p className="text-sm text-gray-600">
              Providing high-quality healthcare services to our community, with a focus on patient experience and outcomes.
            </p>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="text-sm text-gray-600 hover:text-blue-600">
                  Schedule an Appointment
                </Link>
              </li>
              <li>
                <Link href="/intake?patientId=demopatient123" className="text-sm text-gray-600 hover:text-blue-600">
                  Patient Intake
                </Link>
              </li>
              <li>
                <Link href="/referrals" className="text-sm text-gray-600 hover:text-blue-600">
                  Referrals
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/patient/resources" className="text-sm text-gray-600 hover:text-blue-600">
                  Patient Resources
                </Link>
              </li>
              <li>
                <Link href="/insurance" className="text-sm text-gray-600 hover:text-blue-600">
                  Insurance Information
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-4">Contact</h3>
            <p className="text-sm text-gray-600">
              123 Main St<br />
              Pasco County, FL<br />
              (555) 123-4567
            </p>
            <div className="mt-4">
              <Link href="/contact" className="text-sm text-blue-600 hover:text-blue-800">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-center text-gray-500">
            © {currentYear} Premier Healthcare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};