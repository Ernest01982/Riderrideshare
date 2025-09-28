import { supabase } from '../supabaseClient';

export interface ReverseGeocodeResult {
  description: string;
  formatted_address: string;
  place_id?: string;
}

export const reverseGeocode = async (lat: number, lng: number): Promise<ReverseGeocodeResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('maps', {
      body: {
        op: 'reverse_geocode',
        lat,
        lng
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
    console.error('Reverse geocoding failed:', error);
    // Fallback to basic coordinate description
    return {
      description: `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      formatted_address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    };
  }
};