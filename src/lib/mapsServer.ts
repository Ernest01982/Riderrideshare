// lib/mapsServer.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

// Distance Matrix (for ETA/distance previews & pricing inputs)
export async function gmMatrix(
  orig: { lat: number; lng: number },
  dest: { lat: number; lng: number },
  mode: "driving" | "two_wheeler" | "bicycling" | "walking" = "driving"
) {
  const { data, error } = await supabase.functions.invoke("maps", {
    body: {
      op: "matrix",
      origins: `${orig.lat},${orig.lng}`,
      destinations: `${dest.lat},${dest.lng}`,
      mode
    },
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
  const { data, error } = await supabase.functions.invoke("maps", {
    body: {
      op: "directions",
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      mode
    },
  });
  if (error) throw error;
  return data; // Google Directions payload
}