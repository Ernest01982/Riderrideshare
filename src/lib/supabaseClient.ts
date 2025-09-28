import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add proper error handling for invalid environment variables
if (!supabaseUrl.startsWith('https://') && !supabaseUrl.startsWith('http://')) {
  console.error('Invalid Supabase URL format. Please check your VITE_SUPABASE_URL environment variable.');
}

export type Trip = {
  id: string;
  status: 'requested' | 'assigned' | 'driver_enroute' | 'arrived_pickup' | 'on_trip' | 'completed' | 'cancelled';
  driver_id?: string;
  driver_name?: string;
  driver_phone?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_registration?: string;
  pickup_address: string;
  dropoff_address: string;
  created_at: string;
  updated_at: string;
};

export type TripEvent = {
  id: string;
  trip_id: string;
  event_type: string;
  message: string;
  created_at: string;
  metadata?: any;
};

export type DispatchMode = 'manual' | 'auto' | 'offers';