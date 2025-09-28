import { QuotePort, Quote } from "../ports/quote";
import { haversineKm } from "../utils/haversine";

const SPEED_KMPH = 28; // city average
const RATES = { 
  economy: { base: 12, perKm: 9.5, perMin: 1.6 }, 
  xl: { base: 18, perKm: 12, perMin: 2.2 }, 
  delivery: { base: 15, perKm: 10.5, perMin: 1.8 } 
};
const FEE = 2.5; 
const TAX = 0.15;

export const mockQuote: QuotePort = {
  async getQuote({ origin, destination, rideType }) {
    // Add realistic delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    
    const km = Math.max(0.6, haversineKm(origin, destination));
    const mins = Math.max(4, (km / SPEED_KMPH) * 60);
    const r = RATES[rideType];
    const subtotal = r.base + r.perKm * km + r.perMin * mins + FEE;
    const tax = subtotal * TAX;
    const total = Math.round((subtotal + tax) * 100) / 100;
    const now = Date.now();
    
    const q: Quote = {
      id: `mock_${now}`,
      amount: total,
      currency: 'ZAR',
      distanceKm: Math.round(km * 100) / 100,
      durationMin: Math.round(mins),
      breakdown: { 
        base: r.base, 
        perKm: r.perKm * km, 
        perMin: r.perMin * mins, 
        fees: FEE, 
        tax, 
        promo: 0 
      },
      expiresAt: null
    };
    return q;
  }
};