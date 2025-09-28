import { QuotePort, Quote } from "../ports/quote";

// Uses window.google.maps.DistanceMatrixService if available. Dev only!
export const devDistanceMatrixQuote: QuotePort = {
  async getQuote({ origin, destination, rideType }) {
    if (!(window as any).google?.maps?.DistanceMatrixService) {
      throw new Error('DistanceMatrixService not available. Load Google Maps JS or disable VITE_USE_DEV_DISTANCE_JS.');
    }
    
    const svc = new (window as any).google.maps.DistanceMatrixService();
    const result = await new Promise<any>((resolve, reject) => {
      svc.getDistanceMatrix({
        origins: [origin], 
        destinations: [destination],
        travelMode: (window as any).google.maps.TravelMode.DRIVING,
        drivingOptions: { departureTime: new Date() }
      }, (res: any, status: string) => status === 'OK' ? resolve(res) : reject(status));
    });
    
    const el = result.rows[0].elements[0];
    const km = el.distance.value / 1000;
    const mins = Math.max(4, el.duration_in_traffic?.value ? el.duration_in_traffic.value / 60 : el.duration.value / 60);
    
    // simple same rates as mock for consistent FE
    const RATES: any = { 
      economy: { base: 12, perKm: 9.5, perMin: 1.6 }, 
      xl: { base: 18, perKm: 12, perMin: 2.2 }, 
      delivery: { base: 15, perKm: 10.5, perMin: 1.8 } 
    };
    const FEE = 2.5, TAX = 0.15;
    const r = RATES[rideType];
    const subtotal = r.base + r.perKm * km + r.perMin * mins + FEE;
    const tax = subtotal * TAX;
    const total = Math.round((subtotal + tax) * 100) / 100;
    
    const q: Quote = {
      id: `dev_${Date.now()}`,
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