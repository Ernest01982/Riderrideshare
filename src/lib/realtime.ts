import { supabase } from './supabaseClient';
import type { Trip, TripEvent } from './supabaseClient';

export const subscribeTrip = (tripId: string, onChange: (trip: Trip) => void) => {
  const channel = supabase
    .channel('trip-row')
    .on('postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: 'trips', 
        filter: `id=eq.${tripId}` 
      },
      (payload) => {
        if (payload.new) {
          onChange(payload.new as Trip);
        }
      }
    )
    .subscribe();

  return channel;
};

export const subscribeTripEvents = (tripId: string, onEvent: (event: TripEvent) => void) => {
  const channel = supabase
    .channel('trip-events')
    .on('postgres_changes',
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'trip_events', 
        filter: `trip_id=eq.${tripId}` 
      },
      (payload) => {
        if (payload.new) {
          onEvent(payload.new as TripEvent);
        }
      }
    )
    .subscribe();

  return channel;
};

export const unsubscribeChannel = (channel: any) => {
  if (channel) {
    supabase.removeChannel(channel);
  }
};