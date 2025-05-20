import * as yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

/**
 * TourStep interface representing a single step in a tour
 */
export interface TourStep {
  id: string;
  title: string;
  description: string;
  selector?: string;
  elementId?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  audioFile?: string;
}

/**
 * Tour interface representing a complete tour configuration
 */
export interface Tour {
  id: string;
  name: string;
  description: string;
  initialStep: string;
  steps: TourStep[];
}

/**
 * ToursConfig interface representing the entire tours configuration file
 */
export interface ToursConfig {
  tours: {
    [key: string]: Tour;
  };
}

/**
 * Load tours configuration from YAML file
 * @param configPath - Path to the YAML configuration file
 * @returns The parsed tours configuration
 */
export function loadToursConfig(configPath: string): ToursConfig {
  try {
    console.log(`Loading YAML config from: ${configPath}`);
    // Always read fresh from disk to avoid caching issues
    const configFile = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(configFile) as ToursConfig;
    console.log(`Loaded YAML config with ${Object.keys(config.tours).length} tours`);
    
    // Debug first tour steps
    const firstTourId = Object.keys(config.tours)[0];
    if (firstTourId) {
      const steps = config.tours[firstTourId].steps;
      console.log(`Tour ${firstTourId} has ${steps.length} steps`);
      console.log(`Sample step: ${JSON.stringify(steps[0])}`);
    }
    
    return config;
  } catch (error) {
    console.error(`Error loading tours config: ${error}`);
    return { tours: {} };
  }
}

/**
 * Get a specific tour by ID
 * @param configPath - Path to the YAML configuration file
 * @param tourId - ID of the tour to retrieve
 * @returns The requested tour, or undefined if not found
 */
export function getTour(configPath: string, tourId: string): Tour | undefined {
  const config = loadToursConfig(configPath);
  return config.tours[tourId];
}

/**
 * Get all tour steps for a specific tour
 * @param configPath - Path to the YAML configuration file
 * @param tourId - ID of the tour
 * @returns Array of tour steps, or empty array if tour not found
 */
export function getTourSteps(configPath: string, tourId: string): TourStep[] {
  const tour = getTour(configPath, tourId);
  return tour ? tour.steps : [];
}

// Helper function to get the absolute path to the config file
export function getConfigPath(fileName: string): string {
  // In Next.js, paths are relative to the project root
  return path.join(process.cwd(), 'src/config', fileName);
}