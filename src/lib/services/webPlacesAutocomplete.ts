import { AutocompletePort, PlaceItem } from "../ports/autocomplete";

// Check if Google Maps is loaded
const isGoogleMapsLoaded = () => {
  return typeof window !== 'undefined' && window.google?.maps?.places?.AutocompleteService;
};

export const webPlacesAutocomplete: AutocompletePort = {
  async suggest(input, sessionToken) {
    if (!isGoogleMapsLoaded()) {
      console.warn('Google Maps not loaded, falling back to mock data');
      return [];
    }
    
    const google: any = (window as any).google;
    
    try {
      const svc = new google.maps.places.AutocompleteService();
      const predictions = await new Promise<any[]>((resolve, reject) => {
        const timeoutId = setTimeout(() => reject(new Error('Request timeout')), 5000);
        
        svc.getPlacePredictions({ 
          input, 
          sessionToken,
          componentRestrictions: { country: 'za' }, // Restrict to South Africa
          types: ['establishment', 'geocode']
        }, (r: any, status: string) => {
          clearTimeout(timeoutId);
          if (status === 'OK') {
            resolve(r || []);
          } else {
            reject(new Error(`Places API error: ${status}`));
          }
        });
      });
      
      return predictions.map(p => ({ 
        description: p.description, 
        placeId: p.place_id 
      }));
    } catch (error) {
      console.error('Places autocomplete error:', error);
      return [];
    }
  },
    
    return predictions.map(p => ({ 
      description: p.description, 
      placeId: p.place_id 
    }));
  },
  
  async resolve(place, sessionToken) {
    if (place.location) return place;
    if (!place.placeId || !isGoogleMapsLoaded()) return place;
    
    const google: any = (window as any).google;
    // Need a dummy map div for PlacesService in pure JS
    let div = document.getElementById('places-dummy'); 
    if (!div) { 
      div = document.createElement('div'); 
      div.id = 'places-dummy'; 
      div.style.display = 'none'; 
      document.body.appendChild(div); 
    }
    
    const svc = new google.maps.places.PlacesService(div);
    const det: any = await new Promise((resolve, reject) => {
      svc.getDetails({ 
        placeId: place.placeId, 
        sessionToken, 
        fields: ['geometry', 'formatted_address'] 
      }, (r: any, status: string) => status === 'OK' ? resolve(r) : reject(status));
    });
    
    return { 
      ...place, 
      description: det.formatted_address, 
      location: { 
        lat: det.geometry.location.lat(), 
        lng: det.geometry.location.lng() 
      } 
    };
  }
};