import { NextRequest, NextResponse } from 'next/server';
import { getTour } from '@/utils/yamlLoader';
import path from 'path';

/**
 * API route to serve tour configuration data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { tourId: string } }
) {
  const tourId = params.tourId;
  
  try {
    // Get the tour configuration
    const configPath = path.join(process.cwd(), 'src/config/tours.yaml');
    console.log(`Loading tour config from: ${configPath}`);
    
    // For debugging, read the file directly to see content
    const fs = require('fs');
    const yamlContent = fs.readFileSync(configPath, 'utf8');
    console.log(`YAML file content found: ${yamlContent.substring(0, 100)}...`);
    
    const tour = getTour(configPath, tourId);
    console.log(`Loaded tour ${tourId}:`, JSON.stringify(tour).substring(0, 200));
    
    if (!tour) {
      return NextResponse.json(
        { error: `Tour with ID ${tourId} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(tour);
  } catch (error) {
    console.error(`Error loading tour ${tourId}:`, error);
    return NextResponse.json(
      { error: 'Failed to load tour configuration' },
      { status: 500 }
    );
  }
}