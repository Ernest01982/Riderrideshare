// lib/mapsServer.ts
import { supabase } from './supabaseClient';

type LatLng = { lat: number; lng: number };

// Distance Matrix (for ETA/distance previews & pricing inputs)
export async function gmMatrix(
  orig: LatLng,
  dest: LatLng,
  mode: "driving" | "two_wheeler" | "bicycling" | "walking" = "driving"
) {
  // Check if Supabase is properly configured
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    throw new Error('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  }

  try {
    const { data, error } = await supabase.functions.invoke("maps", {
      body: {
        op: "matrix",
        origins: `${orig.lat},${orig.lng}`,
        destinations: `${dest.lat},${dest.lng}`,
        mode
      },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (error) throw error;
    return data; // Google DM payload
  } catch (error) {
    console.error('Maps server error:', error);
    throw new Error('Unable to calculate distance. Please check your Supabase configuration and ensure the maps edge function is deployed.');
  }
}

// Directions (optional: to draw a polyline or debug)
export async function gmDirections(
  origin: LatLng,
  destination: LatLng,
  mode: "driving" | "two_wheeler" | "bicycling" | "walking" = "driving"
) {
  // Check if Supabase is properly configured
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    throw new Error('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  }

  try {
    const { data, error } = await supabase.functions.invoke("maps", {
      body: {
        op: "directions",
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        mode
      },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (error) throw error;
    return data; // Google Directions payload
  } catch (error) {
    console.error('Maps server error:', error);
    throw new Error('Unable to get directions. Please check your Supabase configuration and ensure the maps edge function is deployed.');
  }
}