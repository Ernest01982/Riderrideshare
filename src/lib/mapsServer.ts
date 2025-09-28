// lib/mapsServer.ts
import { createClient } from "@supabase/supabase-js";

// Check if Supabase is properly configured
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Maps functionality will be limited.');
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Distance Matrix (for ETA/distance previews & pricing inputs)
export async function gmMatrix(
  orig: { lat: number; lng: number },
  dest: { lat: number; lng: number },
  mode: "driving" | "two_wheeler" | "bicycling" | "walking" = "driving"
) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  }

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
}

// Directions (optional: to draw a polyline or debug)
export async function gmDirections(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  mode: "driving" | "two_wheeler" | "bicycling" | "walking" = "driving"
) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  }

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
}