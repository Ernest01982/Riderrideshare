import React, { useState, useEffect } from 'react';
import { Home, Briefcase, MapPin, Plus } from 'lucide-react';

type SavedPlace = {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  icon: 'home' | 'work' | 'other';
};

interface SavedPlacesProps {
  onPlaceSelect: (place: { description: string; lat: number; lng: number }) => void;
}

const SavedPlaces: React.FC<SavedPlacesProps> = ({ onPlaceSelect }) => {
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

  // Load saved places from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('rideflow_saved_places');
    if (stored) {
      try {
        setSavedPlaces(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse saved places:', error);
      }
    } else {
      // Initialize with default places
      const defaultPlaces: SavedPlace[] = [
        {
          id: 'home',
          name: 'Home',
          description: 'Add your home address',
          lat: 0,
          lng: 0,
          icon: 'home'
        },
        {
          id: 'work',
          name: 'Work',
          description: 'Add your work address',
          lat: 0,
          lng: 0,
          icon: 'work'
        }
      ];
      setSavedPlaces(defaultPlaces);
      localStorage.setItem('rideflow_saved_places', JSON.stringify(defaultPlaces));
    }
  }, []);

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'work':
        return <Briefcase className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const handlePlaceClick = (place: SavedPlace) => {
    if (place.lat === 0 && place.lng === 0) {
      // Placeholder - in a real app, this would open an address editor
      return;
    }
    
    onPlaceSelect({
      description: place.description,
      lat: place.lat,
      lng: place.lng
    });
  };

  if (savedPlaces.length === 0) return null;

  return (
    <div className="px-4 py-2">
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {savedPlaces.map((place) => (
          <button
            key={place.id}
            onClick={() => handlePlaceClick(place)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors flex-shrink-0 ${
              place.lat === 0 && place.lng === 0
                ? 'border-gray-300 text-gray-500 bg-gray-50'
                : 'border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100'
            }`}
          >
            {getIcon(place.icon)}
            <span className="text-sm font-medium">{place.name}</span>
          </button>
        ))}
        
        {/* Add Place Button - Placeholder for future feature */}
        <button
          className="flex items-center space-x-2 px-4 py-2 rounded-full border border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          disabled
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Add</span>
        </button>
      </div>
    </div>
  );
};

export default SavedPlaces;