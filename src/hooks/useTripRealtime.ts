import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useTripRealtime(tripId: string|null) {
  const [trip, setTrip] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => {
    if (!tripId) return;
    let mounted = true;
    (async () => {
      const { data } = await supabase.from('trips').select('*').eq('id', tripId).single();
      if (mounted) setTrip(data);
      const { data: ev } = await supabase.from('trip_events').select('*').eq('trip_id', tripId).order('at', { ascending: false }).limit(20);
      if (mounted && ev) setEvents(ev);
    })();
    const ch1 = supabase.channel(`trip-${tripId}`)
      .on('postgres_changes',{event:'*',schema:'public',table:'trips',filter:`id=eq.${tripId}`}, p=>setTrip(p.new))
      .subscribe();
    const ch2 = supabase.channel(`trip-events-${tripId}`)
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'trip_events',filter:`trip_id=eq.${tripId}`}, p=>setEvents(prev=>[p.new,...prev]))
      .subscribe();
    return () => { supabase.removeChannel(ch1); supabase.removeChannel(ch2); mounted=false; };
  }, [tripId]);
  return { trip, events };
}