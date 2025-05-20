import React, { useState, useEffect } from 'react';
import { Input } from '../../design-system/components/Input';
import { Select } from '../../design-system/components/Select';
import { ProviderCard } from './ProviderCard';

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

export interface ProviderSearchProps {
  providers: Provider[];
  specialtyId?: string;
  onSelectProvider: (provider: Provider) => void;
  selectedProvider?: Provider;
  className?: string;
}

export const ProviderSearch: React.FC<ProviderSearchProps> = ({
  providers,
  specialtyId,
  onSelectProvider,
  selectedProvider,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>(providers);

  // Create a list of unique locations from all providers
  const locations: Location[] = React.useMemo(() => {
    const uniqueLocations = new Map<string, Location>();
    
    providers.forEach(provider => {
      provider.locations.forEach(location => {
        if (!uniqueLocations.has(location.id)) {
          uniqueLocations.set(location.id, location);
        }
      });
    });
    
    return Array.from(uniqueLocations.values());
  }, [providers]);

  // Filter providers based on search term, specialty, and location
  useEffect(() => {
    let filtered = [...providers];
    
    // Filter by specialty if provided
    if (specialtyId) {
      filtered = filtered.filter(provider => 
        provider.specialties.includes(specialtyId)
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(provider => 
        `${provider.firstName} ${provider.lastName}`.toLowerCase().includes(term) ||
        provider.title.toLowerCase().includes(term)
      );
    }
    
    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter(provider =>
        provider.locations.some(location => location.id === selectedLocation)
      );
    }
    
    setFilteredProviders(filtered);
  }, [providers, searchTerm, specialtyId, selectedLocation]);

  return (
    <div className={`space-y-6 ${className}`}>
      <h2 className="text-xl font-bold text-neutral-800 mb-4">
        Find a provider
      </h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by name or title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        
        <Select
          placeholder="Filter by location"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full md:w-64"
        >
          <option value="">All locations</option>
          {locations.map(location => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </Select>
      </div>
      
      {filteredProviders.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          No providers found that match your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProviders.map(provider => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              isSelected={selectedProvider?.id === provider.id}
              onClick={() => onSelectProvider(provider)}
            />
          ))}
        </div>
      )}
    </div>
  );
};