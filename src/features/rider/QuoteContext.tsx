import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { Quote, QuotePort, RideType } from '../../lib/ports/quote';
import { quoteProvider } from '../../lib/providerHub';
import { debounce } from '../../lib/utils/debounce';

type Point = { description: string; lat: number; lng: number };

type State = {
  pickup?: Point; 
  dropoff?: Point; 
  rideType: RideType;
  quote?: Quote; 
  loading: boolean; 
  error?: string;
  scheduledAt?: string | null;
};

const Ctx = createContext<any>(null);
export const useQuote = () => useContext(Ctx);

export default function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [state, set] = useState<State>({ rideType: 'economy', loading: false });

  const provider = quoteProvider; // one source of truth for FE-only quotes

  async function requestQuote() {
    if (!state.pickup || !state.dropoff) return;
    
    set(s => ({ ...s, loading: true, error: undefined }));
    try {
      const q = await provider.getQuote({
        origin: { lat: state.pickup.lat, lng: state.pickup.lng },
        destination: { lat: state.dropoff.lat, lng: state.dropoff.lng },
        rideType: state.rideType,
        scheduledAt: state.scheduledAt
      });
      set(s => ({ ...s, quote: q, loading: false }));
    } catch (e: any) {
      set(s => ({ ...s, loading: false, error: e.message || 'Failed to get estimate' }));
    }
  }

  // Debounced quote request
  const debouncedRequestQuote = useMemo(() => debounce(requestQuote, 350), [state.pickup, state.dropoff, state.rideType, state.scheduledAt]);

  // Auto-fetch quote when both points are set
  useEffect(() => {
    if (state.pickup && state.dropoff) {
      debouncedRequestQuote();
    } else {
      set(s => ({ ...s, quote: undefined, loading: false, error: undefined }));
    }
  }, [state.pickup, state.dropoff, state.rideType, state.scheduledAt, debouncedRequestQuote]);

  const value = { state, set, requestQuote };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}