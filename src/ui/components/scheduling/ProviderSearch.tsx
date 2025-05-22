import React, { useState, useMemo } from 'react';
import { SimpleProvider } from './types';
import { Card } from '../../design-system/components/Card';
import { Input } from '../../design-system/components/Input';
import { Select } from '../../design-system/components/Select';

export function ProviderSearch({
  providers,
  specialtyId,
  selectedProvider,
  onSelectProvider,
  className = ''
}: {
  providers: SimpleProvider[];
  specialtyId?: string;
  selectedProvider?: SimpleProvider;
  onSelectProvider: (provider: SimpleProvider) => void;
  className?: string;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  // Filter providers by specialty if specified
  const filteredBySpecialty = useMemo(() => {
    if (!specialtyId) return providers;
    return providers.filter(provider => 
      provider.specialties.includes(specialtyId)
    );
  }, [providers, specialtyId]);

  const filteredProviders = useMemo(() => {
    return filteredBySpecialty.filter(provider => {
      const fullName = `${provider.firstName} ${provider.lastName}`;
      const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !selectedLocation || provider.locations.some(l => l.id === selectedLocation);
      return matchesSearch && matchesLocation;
    });
  }, [filteredBySpecialty, searchTerm, selectedLocation]);

  // Get unique locations from all providers
  const locations = useMemo(() => {
    const uniqueLocations = new Set<string>();
    filteredBySpecialty.forEach(provider => {
      provider.locations.forEach(location => {
        uniqueLocations.add(location.id);
      });
    });
    return Array.from(uniqueLocations).map(id => {
      const location = filteredBySpecialty.flatMap(p => p.locations).find(l => l.id === id)!;
      return { value: id, label: location.name };
    });
  }, [filteredBySpecialty]);

  return (
    <div className={className}>
      <div className="mb-6 space-y-4">
        <Input
          type="text"
          placeholder="Search providers by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          placeholder="Filter by location"
        >
          <option value="">All locations</option>
          {locations.map(location => (
            <option key={location.value} value={location.value}>
              {location.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProviders.map((provider) => (
          <button
            key={provider.id}
            type="button"
            className="w-full text-left focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
            onClick={() => onSelectProvider(provider)}
          >
            <Card
              hoverable
              className={`h-full transition-colors ${
                selectedProvider?.id === provider.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'hover:border-gray-300'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {provider.profileImage && (
                    <img
                      src={provider.profileImage}
                      alt={`${provider.firstName} ${provider.lastName}`}
                      className="w-20 h-20 rounded-full object-cover"
                      onError={(e) => {
                        // Hide image if it fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      Dr. {provider.firstName} {provider.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {provider.title}
                    </p>
                    <div className="mt-1 text-sm text-gray-600">
                      {provider.specialties.join(', ')}
                    </div>
                    {provider.rating && (
                      <div className="flex items-center mt-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(provider.rating!) ? 'fill-current' : 'fill-gray-300'
                              }`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-sm text-gray-600">
                          ({provider.rating})
                        </span>
                      </div>
                    )}
                    <div className="mt-2 text-sm text-gray-500">
                      {provider.locations[0]?.name}
                    </div>
                    {provider.availabilityStatus && (
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          provider.availabilityStatus === 'available-today' 
                            ? 'bg-green-100 text-green-800'
                            : provider.availabilityStatus === 'available-week'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {provider.availabilityStatus === 'available-today' ? 'Available Today' :
                           provider.availabilityStatus === 'available-week' ? 'Available This Week' :
                           'Limited Availability'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </button>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No providers found matching your criteria
        </div>
      )}
    </div>
  );
}