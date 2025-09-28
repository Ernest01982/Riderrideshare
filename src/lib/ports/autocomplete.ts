export interface PlaceItem {
  description: string;
  placeId?: string;
  location?: { lat: number; lng: number }; // present when resolved
}

export interface AutocompletePort {
  suggest(input: string, sessionToken: string): Promise<PlaceItem[]>;
  resolve(place: PlaceItem, sessionToken: string): Promise<PlaceItem>; // fills location
}