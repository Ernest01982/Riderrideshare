import { AutocompletePort, PlaceItem } from "../ports/autocomplete";

const CAPE_TOWN_PLACES: PlaceItem[] = [
  { description: 'V&A Waterfront, Cape Town', location: { lat: -33.906, lng: 18.419 } },
  { description: 'Cape Town International Airport', location: { lat: -33.971, lng: 18.602 } },
  { description: 'Stellenbosch University', location: { lat: -33.932, lng: 18.864 } },
  { description: 'Canal Walk, Century City', location: { lat: -33.892, lng: 18.515 } },
  { description: 'Table Mountain Cableway', location: { lat: -33.928, lng: 18.410 } },
  { description: 'Camps Bay Beach', location: { lat: -33.951, lng: 18.377 } },
  { description: 'Kirstenbosch Botanical Gardens', location: { lat: -33.988, lng: 18.432 } },
  { description: 'Sea Point Promenade', location: { lat: -33.915, lng: 18.381 } },
  { description: 'Green Point Stadium', location: { lat: -33.903, lng: 18.410 } },
  { description: 'Muizenberg Beach', location: { lat: -34.103, lng: 18.466 } }
];

const enableMocks = import.meta.env.VITE_ENABLE_MOCKS === 'true';

export const mockAutocomplete: AutocompletePort = {
  async suggest(q, _s) {
    if (!enableMocks) {
      console.warn('Mock autocomplete disabled. Enable with VITE_ENABLE_MOCKS=true');
      return [];
    }
    if (!q) return [];
    // Add realistic delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    return CAPE_TOWN_PLACES.filter(x => x.description.toLowerCase().includes(q.toLowerCase())).slice(0, 6);
  },
  async resolve(p, _s) { 
    return p.location ? p : p; 
  }
};