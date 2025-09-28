import { supabase } from '../supabaseClient';

export interface ReverseGeocodeResult {
  description: string;
  formatted_address: string;
  place_id?: string;
}

// Fallback reverse geocoding using a simple coordinate-to-address format
const fallbackReverseGeocode = (lat: number, lng: number): ReverseGeocodeResult => {
  // Create a more user-friendly coordinate description
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  const description = `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
  
  return {
    description: `Location: ${description}`,
    formatted_address: description
  };
};

export const reverseGeocode = async (lat: number, lng: number): Promise<ReverseGeocodeResult> => {
  try {
    // Check if Supabase is properly configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured, using fallback reverse geocoding');
      return fallbackReverseGeocode(lat, lng);
    }

    const { data, error } = await supabase.functions.invoke('maps', {
      body: {
        op: 'reverse_geocode',
        lat,
        lng
      },
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (error) throw error;

    if (data?.results?.[0]) {
      const result = data.results[0];
      return {
        description: result.formatted_address,
        formatted_address: result.formatted_address,
        place_id: result.place_id
      };
    }

    throw new Error('No address found for this location');
  } catch (error) {
    console.warn('Reverse geocoding failed, using fallback:', error);
    return fallbackReverseGeocode(lat, lng);
  }
};