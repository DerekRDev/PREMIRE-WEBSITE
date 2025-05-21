import React, { useState, useEffect } from 'react';
import { Input } from '../../design-system/components/Input';
import { Select } from '../../design-system/components/Select';
import { Button } from '../../design-system/components/Button';
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
  bio?: string;
  education?: string[];
  languages?: string[];
  yearsOfExperience?: number;
  acceptingNewPatients?: boolean;
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
    
    if (specialtyId) {
      filtered = filtered.filter(provider => 
        provider.specialties.includes(specialtyId)
      );
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(provider => 
        `${provider.firstName} ${provider.lastName}`.toLowerCase().includes(term) ||
        provider.title.toLowerCase().includes(term)
      );
    }
    
    if (selectedLocation) {
      filtered = filtered.filter(provider =>
        provider.locations.some(location => location.id === selectedLocation)
      );
    }
    
    setFilteredProviders(filtered);
  }, [providers, searchTerm, specialtyId, selectedLocation]);

  const handlePrint = () => {
    if (selectedProvider) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Provider Details - ${selectedProvider.firstName} ${selectedProvider.lastName}</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
                h1 { color: #1e40af; margin-bottom: 1rem; }
                h2 { color: #1e40af; margin-top: 1.5rem; }
                .section { margin-bottom: 1.5rem; }
                .label { font-weight: bold; color: #4b5563; }
                ul { padding-left: 1.5rem; }
                li { margin-bottom: 0.5rem; }
              </style>
            </head>
            <body>
              <h1>${selectedProvider.firstName} ${selectedProvider.lastName}</h1>
              <div class="section">
                <p class="label">Title:</p>
                <p>${selectedProvider.title}</p>
              </div>
              ${selectedProvider.bio ? `
                <div class="section">
                  <h2>About</h2>
                  <p>${selectedProvider.bio}</p>
                </div>
              ` : ''}
              ${selectedProvider.education ? `
                <div class="section">
                  <h2>Education</h2>
                  <ul>
                    ${selectedProvider.education.map(edu => `<li>${edu}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              ${selectedProvider.languages ? `
                <div class="section">
                  <h2>Languages</h2>
                  <p>${selectedProvider.languages.join(', ')}</p>
                </div>
              ` : ''}
              <div class="section">
                <h2>Locations</h2>
                <ul>
                  ${selectedProvider.locations.map(loc => `
                    <li>
                      <p><strong>${loc.name}</strong></p>
                      <p>${loc.address}</p>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Provider
        </h2>
        <p className="text-gray-600">
          Select a healthcare provider that best meets your needs.
        </p>
      </div>
      
      <div className="flex gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1">
          <Input
            placeholder="Search by name or title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          
          <Select
            placeholder="Filter by location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="max-w-xs"
          >
            <option value="">All locations</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </Select>
        </div>

        {selectedProvider && (
          <Button
            onClick={handlePrint}
            variant="outline"
            className="whitespace-nowrap"
          >
            Print Details
          </Button>
        )}
      </div>
      
      {filteredProviders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">
            No providers found that match your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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