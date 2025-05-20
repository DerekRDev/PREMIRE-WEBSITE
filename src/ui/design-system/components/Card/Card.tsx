import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  footer?: React.ReactNode;
  hoverable?: boolean;
  bordered?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  footer,
  hoverable = false,
  bordered = true,
  className = '',
}) => {
  const baseClasses = 'bg-white rounded-lg overflow-hidden';
  const hoverClasses = hoverable ? 'transition-shadow hover:shadow-lg' : '';
  const borderClasses = bordered ? 'border border-neutral-200' : '';
  const shadowClasses = 'shadow-sm';

  return (
    <div className={`${baseClasses} ${hoverClasses} ${borderClasses} ${shadowClasses} ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-medium text-neutral-700">{title}</h3>
        </div>
      )}
      <div className={title ? 'p-6' : 'p-6'}>
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200">
          {footer}
        </div>
      )}
    </div>
  );
};