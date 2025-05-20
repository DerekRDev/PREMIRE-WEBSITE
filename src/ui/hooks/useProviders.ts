import { useState, useEffect, useCallback } from 'react';
import { Provider } from '../../core/entities/Provider';

interface UseProvidersOptions {
  specialtyId?: string;
  locationId?: string;
  initialProviders?: Provider[];
}

interface UseProvidersResult {
  providers: Provider[];
  loading: boolean;
  error: Error | null;
  searchProviders: (searchTerm: string) => void;
  filterBySpecialty: (specialtyId: string | undefined) => void;
  filterByLocation: (locationId: string | undefined) => void;
  resetFilters: () => void;
}

export const useProviders = (options: UseProvidersOptions = {}): UseProvidersResult => {
  const [providers, setProviders] = useState<Provider[]>(options.initialProviders || []);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>(providers);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | undefined>(options.specialtyId);
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(options.locationId);

  // Fetch providers on initial load
  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real implementation, we would call an API here
        // For this example, we'll just use the initial providers or mock data
        if (!options.initialProviders) {
          // This is where we'd normally fetch from an API
          // For now, let's create some mock data
          const mockProviders: Provider[] = [
            {
              id: 'provider-1',
              firstName: 'John',
              lastName: 'Smith',
              title: 'MD',
              specialties: ['cardiology', 'internal-medicine'],
              locations: [
                {
                  id: 'location-1',
                  name: 'Main Hospital',
                  address: '123 Medical Center Dr, City, State 12345'
                }
              ],
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              id: 'provider-2',
              firstName: 'Sarah',
              lastName: 'Johnson',
              title: 'MD',
              specialties: ['pediatrics'],
              locations: [
                {
                  id: 'location-1',
                  name: 'Main Hospital',
                  address: '123 Medical Center Dr, City, State 12345'
                },
                {
                  id: 'location-2',
                  name: 'North Clinic',
                  address: '456 Health Pkwy, City, State 12345'
                }
              ],
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              id: 'provider-3',
              firstName: 'Michael',
              lastName: 'Williams',
              title: 'DO',
              specialties: ['family-medicine', 'geriatrics'],
              locations: [
                {
                  id: 'location-2',
                  name: 'North Clinic',
                  address: '456 Health Pkwy, City, State 12345'
                }
              ],
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ];
          
          setProviders(mockProviders);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchProviders();
  }, [options.initialProviders]);

  // Apply filters whenever the filters or providers change
  useEffect(() => {
    let filtered = [...providers];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(provider => 
        `${provider.firstName} ${provider.lastName}`.toLowerCase().includes(term) ||
        provider.title.toLowerCase().includes(term)
      );
    }
    
    // Filter by specialty
    if (selectedSpecialty) {
      filtered = filtered.filter(provider => 
        provider.specialties.includes(selectedSpecialty)
      );
    }
    
    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter(provider =>
        provider.locations.some(location => location.id === selectedLocation)
      );
    }
    
    setFilteredProviders(filtered);
  }, [providers, searchTerm, selectedSpecialty, selectedLocation]);

  // Search providers by name or title
  const searchProviders = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // Filter providers by specialty
  const filterBySpecialty = useCallback((specialtyId: string | undefined) => {
    setSelectedSpecialty(specialtyId);
  }, []);

  // Filter providers by location
  const filterByLocation = useCallback((locationId: string | undefined) => {
    setSelectedLocation(locationId);
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedSpecialty(undefined);
    setSelectedLocation(undefined);
  }, []);

  return {
    providers: filteredProviders,
    loading,
    error,
    searchProviders,
    filterBySpecialty,
    filterByLocation,
    resetFilters
  };
};