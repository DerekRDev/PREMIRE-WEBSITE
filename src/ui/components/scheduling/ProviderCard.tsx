import React from 'react';
import { Card } from '../../design-system/components/Card';
import Image from 'next/image';

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
  bio?: string;
  education?: string[];
  languages?: string[];
  yearsOfExperience?: number;
  acceptingNewPatients?: boolean;
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
    <div 
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card
        className={`transition-all ${
          isSelected 
            ? 'border-2 border-primary-500 bg-blue-50' 
            : 'border border-neutral-200 hover:border-primary-200'
        } ${className}`}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Provider Photo/Initials */}
            <div className="flex-shrink-0">
              {provider.profileImage ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={provider.profileImage}
                    alt={`${provider.firstName} ${provider.lastName}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-medium">
                  {provider.firstName.charAt(0)}{provider.lastName.charAt(0)}
                </div>
              )}
            </div>
            
            {/* Provider Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {provider.firstName} {provider.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{provider.title}</p>
                  
                  <div className="flex items-center gap-2">
                    {provider.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-sm bg-blue-100 text-blue-700"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                
                {provider.acceptingNewPatients !== false && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-sm bg-green-100 text-green-800">
                    Accepting Patients
                  </span>
                )}
              </div>

              {provider.yearsOfExperience && (
                <p className="mt-2 text-sm text-gray-600">
                  {provider.yearsOfExperience}+ Years Experience
                </p>
              )}

              {/* Expanded Details */}
              {isSelected && (
                <div className="mt-6 space-y-4 border-t border-gray-200 pt-4">
                  {provider.bio && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">About</h4>
                      <p className="text-sm text-gray-600">{provider.bio}</p>
                    </div>
                  )}
                  
                  {provider.education && provider.education.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Education</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {provider.education.map((edu, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{edu}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {provider.languages && provider.languages.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Languages</h4>
                      <p className="text-sm text-gray-600">
                        {provider.languages.join(', ')}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Locations</h4>
                    <div className="text-sm text-gray-600">
                      {provider.locations.map(location => location.name).join(', ')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};