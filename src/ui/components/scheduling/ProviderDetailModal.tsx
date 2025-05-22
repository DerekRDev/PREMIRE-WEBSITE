import React from 'react';
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

export interface ProviderDetailModalProps {
  provider: Provider;
  isOpen: boolean;
  onClose: () => void;
  onBookNow?: () => void;
  onSelectProvider?: () => void;
}

export const ProviderDetailModal: React.FC<ProviderDetailModalProps> = ({
  provider,
  isOpen,
  onClose,
  onBookNow,
  onSelectProvider,
}) => {
  if (!isOpen) return null;

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
          weekday: 'long',
          month: 'long', 
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
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-lg text-gray-700 ml-2 font-medium">({rating})</span>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-100 max-w-2xl w-full max-h-[90vh] overflow-y-auto ring-1 ring-black/5">
          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/80 rounded-full transition-all duration-200 border border-gray-200 bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Provider Header */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                {provider.profileImage ? (
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg border-2 border-gray-100">
                    <Image
                      src={provider.profileImage}
                      alt={`${provider.firstName} ${provider.lastName}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 text-4xl font-medium shadow-lg ring-4 ring-white border-2 border-gray-100">
                    {provider.firstName.charAt(0)}{provider.lastName.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {provider.firstName} {provider.lastName}
                </h2>
                <p className="text-lg text-gray-600 mb-3">{provider.title}</p>
                
                {/* Rating */}
                {provider.rating && (
                  <div className="mb-4">
                    {renderStars(provider.rating)}
                  </div>
                )}
                
                {/* Availability Status */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getAvailabilityColor(provider.availabilityStatus)}`}>
                  <div className="w-2 h-2 rounded-full bg-current"></div>
                  <span>{getAvailabilityText(provider.availabilityStatus)}</span>
                </div>
                
                {provider.nextAvailable && (
                  <div className="mt-3">
                    <span className="text-sm font-medium text-gray-700">Next Available: </span>
                    <span className="text-sm text-primary-600 font-semibold text-lg">
                      {formatNextAvailable(provider.nextAvailable)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="px-6 pb-6">
            {/* Specialties */}
            <div className="mb-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {provider.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    {specialty.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
            
            {/* About */}
            {provider.bio && (
              <div className="mb-6 p-4 bg-blue-50/30 rounded-xl border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                <p className="text-gray-600 leading-relaxed">{provider.bio}</p>
              </div>
            )}
            
            {/* Experience & Credentials Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Education */}
              {provider.education && provider.education.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Education</h3>
                  <ul className="space-y-2">
                    {provider.education.map((edu, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-primary-500 mt-2 mr-3 flex-shrink-0"></span>
                        <span>{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Languages & Experience */}
              <div className="space-y-4">
                {provider.languages && provider.languages.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Languages</h3>
                    <p className="text-gray-600">{provider.languages.join(', ')}</p>
                  </div>
                )}
                
                {provider.yearsOfExperience && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Experience</h3>
                    <p className="text-gray-600">{provider.yearsOfExperience}+ years of practice</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Locations */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Locations</h3>
              <div className="space-y-3">
                {provider.locations.map((location, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                    <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-900">{location.name}</div>
                      <div className="text-sm text-gray-600">{location.address}</div>
                      {location.distance && (
                        <div className="text-sm text-primary-600 font-medium mt-1">
                          {location.distance} miles away
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-white p-4 -mx-6 -mb-6 rounded-b-2xl">
              {onSelectProvider && (
                <Button
                  onClick={() => {
                    onSelectProvider();
                    onClose();
                  }}
                  variant="outline"
                  className="flex-1"
                  size="large"
                >
                  Select Provider
                </Button>
              )}
              
              {onBookNow && (
                <Button
                  onClick={() => {
                    onBookNow();
                    onClose();
                  }}
                  variant="primary"
                  className="flex-1"
                  size="large"
                >
                  Book Appointment
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};