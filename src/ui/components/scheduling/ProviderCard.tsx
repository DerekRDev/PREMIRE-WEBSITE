import React from 'react';
import { Card } from '../../design-system/components/Card';

interface Location {
  id: string;
  name: string;
  address: string;
}

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  specialties: string[];
  profileImage?: string;
  locations: Location[];
}

export interface ProviderCardProps {
  provider: Provider;
  isSelected?: boolean;
  onClick: () => void;
  className?: string;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  isSelected = false,
  onClick,
  className = '',
}) => {
  return (
    <Card
      className={`cursor-pointer transition-all p-4 hover:shadow-md ${
        isSelected ? 'border-2 border-primary-500' : 'border border-neutral-200'
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-4">
          {provider.profileImage ? (
            <img
              src={provider.profileImage}
              alt={`${provider.firstName} ${provider.lastName}`}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xl font-medium">
              {provider.firstName.charAt(0)}{provider.lastName.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-neutral-800">
                {provider.firstName} {provider.lastName}
              </h3>
              <p className="text-sm text-neutral-600">{provider.title}</p>
              
              <div className="mt-1 flex flex-wrap gap-1">
                {provider.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs bg-primary-50 text-primary-700 rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="text-right">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Available
              </span>
            </div>
          </div>
          
          <div className="mt-3 text-sm text-neutral-500">
            <div>
              <strong>Locations:</strong>{' '}
              {provider.locations.map(location => location.name).join(', ')}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};