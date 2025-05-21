import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();
  
  // Skip breadcrumbs for home page
  if (pathname === '/') {
    return null;
  }
  
  // Split path into segments
  const segments = pathname.split('/').filter(Boolean);
  
  // Handle query parameters for paths like /intake?patientId=123
  segments.forEach((segment, index) => {
    if (segment.includes('?')) {
      segments[index] = segment.split('?')[0];
    }
  });
  
  // Construct breadcrumb items with path accumulation
  const breadcrumbItems = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`;
    
    // Format label from segment (capitalize, replace hyphens with spaces)
    const label = segment
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return { path, label };
  });
  
  // Add Home as the first breadcrumb
  breadcrumbItems.unshift({ path: '/', label: 'Home' });

  return (
    <nav className="bg-white border-b border-neutral-200 py-3 px-4">
      <div className="max-w-7xl mx-auto">
        <ol className="flex flex-wrap items-center space-x-2 text-sm text-neutral-500">
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.path}>
              {index > 0 && (
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
              )}
              <li>
                {index === breadcrumbItems.length - 1 ? (
                  <span className="font-medium text-primary-700">{item.label}</span>
                ) : (
                  <Link href={item.path} className="hover:text-primary-600 transition-colors">
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </div>
    </nav>
  );
};