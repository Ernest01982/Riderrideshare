import { AutocompletePort, PlaceItem } from "../ports/autocomplete";

export const webPlacesAutocomplete: AutocompletePort = {
  async suggest(input, sessionToken) {
    const google: any = (window as any).google;
    if (!google?.maps?.places?.AutocompleteService) return [];
    
    const svc = new google.maps.places.AutocompleteService();
    const predictions = await new Promise<any[]>((resolve) => {
      svc.getPlacePredictions({ 
        input, 
        sessionToken,
        componentRestrictions: { country: 'za' }, // Restrict to South Africa
        types: ['establishment', 'geocode']
      }, (r: any) => resolve(r || []));
    });
    
    return predictions.map(p => ({ 
      description: p.description, 
      placeId: p.place_id 
    }));
  },
  
  async resolve(place, sessionToken) {
    const google: any = (window as any).google;
    if (place.location) return place;
    if (!place.placeId || !google?.maps?.places?.PlacesService) return place;
    
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