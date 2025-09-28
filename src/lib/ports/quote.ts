export type LatLng = { lat: number; lng: number };
export type RideType = 'economy' | 'xl' | 'delivery';

export interface QuoteBreakdown {
  base: number; 
  perKm: number; 
  perMin: number;
  fees: number; 
  tax: number; 
  promo: number;
}

export interface Quote {
  id: string;                      // ephemeral in FE
  amount: number; 
  currency: 'ZAR';
  distanceKm: number; 
  durationMin: number;
  breakdown: QuoteBreakdown; 
  expiresAt: string | null;
  polyline?: string;
}

export interface QuotePort {
  getQuote(input: {
    origin: LatLng; 
    destination: LatLng; 
    rideType: RideType; 
    scheduledAt?: string | null;
  }): Promise<Quote>;
}