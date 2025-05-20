'use client';

import { useEffect, useState } from 'react';
import { Tour, TourStep } from '@/utils/yamlLoader';

/**
 * Hook for loading tour configuration
 * This client-side hook loads tour configuration from the YAML file
 */
export function useTourConfig(tourId: string = 'quick_tour') {
  const [tourConfig, setTourConfig] = useState<Tour | null>(null);
  const [tourSteps, setTourSteps] = useState<TourStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        // In Next.js client components, we need to use fetch to load the config
        // We'll create an API endpoint that serves our YAML config
        const response = await fetch(`/api/tours/${tourId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load tour config: ${response.statusText}`);
        }
        
        const tourData = await response.json();
        setTourConfig(tourData);
        setTourSteps(tourData.steps || []);
        setLoading(false);
      } catch (err) {
        console.error('Error loading tour config:', err);
        setError(err instanceof Error ? err.message : 'Unknown error loading tour config');
        setLoading(false);
      }
    }
    
    loadConfig();
  }, [tourId]);

  return { tourConfig, tourSteps, loading, error };
}