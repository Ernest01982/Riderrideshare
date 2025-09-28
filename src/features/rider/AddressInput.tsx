import React, { useState, useEffect, useRef } from 'react';
import { Navigation, MapPin, ArrowUpDown, X } from 'lucide-react';
import { AutocompletePort, PlaceItem } from '../../lib/ports/autocomplete';
import { mockAutocomplete } from '../../lib/services/mockAutocomplete';
import { webPlacesAutocomplete } from '../../lib/services/webPlacesAutocomplete';
import { debounce } from '../../lib/utils/debounce';
import { useQuote } from './QuoteContext';

type Point = { description: string; lat: number; lng: number };

interface AddressInputProps {
  pickup?: Point;
  dropoff?: Point;
  onPickupChange: (point?: Point) => void;
  onDropoffChange: (point?: Point) => void;
}

const AddressInput: React.FC<AddressInputProps> = ({
  pickup,
  dropoff,
  onPickupChange,
  onDropoffChange
}) => {
  const [pickupInput, setPickupInput] = useState(pickup?.description || '');
  const [dropoffInput, setDropoffInput] = useState(dropoff?.description || '');
  const [pickupSuggestions, setPickupSuggestions] = useState<PlaceItem[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<PlaceItem[]>([]);
  const [activeField, setActiveField] = useState<'pickup' | 'dropoff' | null>(null);
  const [sessionToken] = useState(() => Math.random().toString(36));
  
  const pickupRef = useRef<HTMLInputElement>(null);
  const dropoffRef = useRef<HTMLInputElement>(null);

  // Choose autocomplete provider based on Google Maps availability
  const autocompleteProvider: AutocompletePort = typeof window !== 'undefined' && window.google?.maps?.places?.AutocompleteService 
    ? webPlacesAutocomplete 
    : mockAutocomplete;

  // Debounced suggestion fetchers
  const fetchPickupSuggestions = debounce(async (input: string) => {
    if (!input.trim()) {
      setPickupSuggestions([]);
      return;
    }
    try {
      const suggestions = await autocompleteProvider.suggest(input, sessionToken);
      setPickupSuggestions(suggestions);
    } catch (error) {
      console.error('Failed to fetch pickup suggestions:', error);
      setPickupSuggestions([]);
    }
  }, 300);

  const fetchDropoffSuggestions = debounce(async (input: string) => {
    if (!input.trim()) {
      setDropoffSuggestions([]);
      return;
    }
    try {
      const suggestions = await autocompleteProvider.suggest(input, sessionToken);
      setDropoffSuggestions(suggestions);
    } catch (error) {
      console.error('Failed to fetch dropoff suggestions:', error);
      setDropoffSuggestions([]);
    }
  }, 300);

  // Handle input changes
  const handlePickupInputChange = (value: string) => {
    setPickupInput(value);
    if (!value.trim()) {
      onPickupChange(undefined);
      setPickupSuggestions([]);
    } else {
      fetchPickupSuggestions(value);
    }
  };

  const handleDropoffInputChange = (value: string) => {
    setDropoffInput(value);
    if (!value.trim()) {
      onDropoffChange(undefined);
      setDropoffSuggestions([]);
    } else {
      fetchDropoffSuggestions(value);
    }
  };

  // Handle suggestion selection
  const handlePickupSelect = async (suggestion: PlaceItem) => {
    try {
      const resolved = await autocompleteProvider.resolve(suggestion, sessionToken);
      if (resolved.location) {
        const point: Point = {
          description: resolved.description,
          lat: resolved.location.lat,
          lng: resolved.location.lng
        };
        onPickupChange(point);
        setPickupInput(resolved.description);
      }
    } catch (error) {
      console.error('Failed to resolve pickup place:', error);
    }
    setPickupSuggestions([]);
    setActiveField(null);
  };

  const handleDropoffSelect = async (suggestion: PlaceItem) => {
    try {
      const resolved = await autocompleteProvider.resolve(suggestion, sessionToken);
      if (resolved.location) {
        const point: Point = {
          description: resolved.description,
          lat: resolved.location.lat,
          lng: resolved.location.lng
        };
        onDropoffChange(point);
        setDropoffInput(resolved.description);
      }
    } catch (error) {
      console.error('Failed to resolve dropoff place:', error);
    }
    setDropoffSuggestions([]);
    setActiveField(null);
  };

  // Handle swap
  const handleSwap = () => {
    const tempPickup = pickup;
    const tempPickupInput = pickupInput;
    
    onPickupChange(dropoff);
    onDropoffChange(tempPickup);
    setPickupInput(dropoffInput);
    setDropoffInput(tempPickupInput);
  };

  // Clear input
  const clearPickup = () => {
    setPickupInput('');
    onPickupChange(undefined);
    setPickupSuggestions([]);
  };

  const clearDropoff = () => {
    setDropoffInput('');
    onDropoffChange(undefined);
    setDropoffSuggestions([]);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickupRef.current && !pickupRef.current.contains(event.target as Node) &&
        dropoffRef.current && !dropoffRef.current.contains(event.target as Node)
      ) {
        setActiveField(null);
        setPickupSuggestions([]);
        setDropoffSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Where to?</h2>
      
      <div className="space-y-4">
        {/* Pickup Input */}
        <div className="relative" ref={pickupRef}>
          <div className="relative">
            <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
            <input
              type="text"
              value={pickupInput}
              onChange={(e) => handlePickupInputChange(e.target.value)}
              onFocus={() => setActiveField('pickup')}
              aria-label="Pickup location"
              aria-describedby="pickup-help"
              aria-expanded={activeField === 'pickup' && pickupSuggestions.length > 0}
              aria-autocomplete="list"
              role="combobox"
              className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Pickup location"
            />
            <div id="pickup-help" className="sr-only">
              Enter your pickup location. Suggestions will appear as you type.
            </div>
            {pickupInput && (
              <button
                onClick={clearPickup}
                aria-label="Clear pickup location"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          
          {/* Pickup Suggestions */}
          {activeField === 'pickup' && pickupSuggestions.length > 0 && (
            <div 
              className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto"
              role="listbox"
              aria-label="Pickup location suggestions"
            >
              {pickupSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handlePickupSelect(suggestion)}
                  role="option"
                  aria-selected={false}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                >
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-900 truncate">{suggestion.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            disabled={!pickup && !dropoff}
            aria-label="Swap pickup and destination locations"
            className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors"
          >
            <ArrowUpDown className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Dropoff Input */}
        <div className="relative" ref={dropoffRef}>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
            <input
              type="text"
              value={dropoffInput}
              onChange={(e) => handleDropoffInputChange(e.target.value)}
              onFocus={() => setActiveField('dropoff')}
              aria-label="Destination"
              aria-describedby="dropoff-help"
              aria-expanded={activeField === 'dropoff' && dropoffSuggestions.length > 0}
              aria-autocomplete="list"
              role="combobox"
              className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Where are you going?"
            />
            <div id="dropoff-help" className="sr-only">
              Enter your destination. Suggestions will appear as you type.
            </div>
            {dropoffInput && (
              <button
                onClick={clearDropoff}
                aria-label="Clear destination"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          
          {/* Dropoff Suggestions */}
          {activeField === 'dropoff' && dropoffSuggestions.length > 0 && (
            <div 
              className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto"
              role="listbox"
              aria-label="Destination suggestions"
            >
              {dropoffSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleDropoffSelect(suggestion)}
                  role="option"
                  aria-selected={false}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                >
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-900 truncate">{suggestion.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressInput;