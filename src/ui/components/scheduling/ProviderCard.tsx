import React from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import Image from 'next/image';

interface Location {
  id: string;
  name: string;
  address: string;
  distance?: number;
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
  rating?: number;
  nextAvailable?: string;
  availabilityStatus?: 'available-today' | 'available-week' | 'limited' | 'unavailable';
}

export interface ProviderCardProps {
  provider: Provider;
  isSelected?: boolean;
  onClick: () => void;
  onBookNow?: () => void;
  onReadMore?: () => void;
  className?: string;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  isSelected = false,
  onClick,
  onBookNow,
  onReadMore,
  className = '',
}) => {
  const getAvailabilityColor = (status?: string) => {
    switch (status) {
      case 'available-today': return 'bg-green-100 text-green-800 border-green-200';
      case 'available-week': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'limited': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unavailable': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getAvailabilityText = (status?: string) => {
    switch (status) {
      case 'available-today': return 'Available Today';
      case 'available-week': return 'Available This Week';
      case 'limited': return 'Limited Availability';
      case 'unavailable': return 'Unavailable';
      default: return 'Accepting Patients';
    }
  };

  const formatNextAvailable = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      } else {
        return date.toLocaleDateString(undefined, { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch {
      return dateStr;
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div 
      onClick={onClick}
      className="cursor-pointer group"
    >
      <Card
        className={`transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
          isSelected 
            ? 'border-2 border-primary-500 bg-blue-50 shadow-md' 
            : 'border border-neutral-200 hover:border-primary-200 shadow-sm'
        } ${className}`}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Provider Photo */}
            <div className="flex-shrink-0 relative">
              {provider.profileImage ? (
                <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-white shadow-md">
                  <Image
                    src={provider.profileImage}
                    alt={`${provider.firstName} ${provider.lastName}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 text-xl font-medium shadow-md ring-2 ring-white">
                  {provider.firstName.charAt(0)}{provider.lastName.charAt(0)}
                </div>
              )}
              
              {/* Availability Status Badge */}
              <div className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getAvailabilityColor(provider.availabilityStatus)}`}>
                {provider.availabilityStatus === 'available-today' ? '●' : 
                 provider.availabilityStatus === 'available-week' ? '◐' : 
                 provider.availabilityStatus === 'limited' ? '◯' : '○'}
              </div>
            </div>
            
            {/* Provider Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {provider.firstName} {provider.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{provider.title}</p>
                  
                  {/* Rating */}
                  {provider.rating && (
                    <div className="mb-2">
                      {renderStars(provider.rating)}
                    </div>
                  )}
                </div>
                
                {/* Quick Action Button */}
                {onBookNow && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookNow();
                    }}
                    variant="primary"
                    size="small"
                    className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    Book Now
                  </Button>
                )}
              </div>

              {/* Availability Info */}
              <div className="mb-3">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getAvailabilityColor(provider.availabilityStatus)}`}>
                  <span>{getAvailabilityText(provider.availabilityStatus)}</span>
                </div>
                
                {provider.nextAvailable && (
                  <div className="mt-2">
                    <span className="text-sm font-medium text-gray-700">Next Available: </span>
                    <span className="text-sm text-primary-600 font-semibold">
                      {formatNextAvailable(provider.nextAvailable)}
                    </span>
                  </div>
                )}
              </div>

              {/* Specialty Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {provider.specialties.slice(0, 2).map((specialty, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    {specialty.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
                {provider.specialties.length > 2 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
                    +{provider.specialties.length - 2} more
                  </span>
                )}
              </div>

              {/* Location & Experience */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                {provider.locations[0]?.distance && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{provider.locations[0].distance} mi</span>
                  </div>
                )}
                
                {provider.yearsOfExperience && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{provider.yearsOfExperience}+ Years</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{provider.locations[0]?.name}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {onReadMore && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReadMore();
                    }}
                    variant="outline"
                    size="small"
                    className="flex-1"
                  >
                    Read More
                  </Button>
                )}
                
                {onBookNow && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookNow();
                    }}
                    variant="primary"
                    size="small"
                    className="flex-1"
                  >
                    Book Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};