import React from 'react';
import { Navigation, MapPin, Clock, Route } from 'lucide-react';
import EstimatePreview from '../../components/EstimatePreview';

type Point = { description: string; lat: number; lng: number };

interface MapPreviewProps {
  pickup?: Point;
  dropoff?: Point;
  distanceKm?: number;
  durationMin?: number;
}

const MapPreview: React.FC<MapPreviewProps> = ({ 
  pickup, 
  dropoff, 
  distanceKm, 
  durationMin 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Map Area */}
      <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 relative flex items-center justify-center">
        {pickup && dropoff ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Simple visual representation */}
            <div className="absolute inset-4 flex items-center justify-between">
              {/* Pickup Marker */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Navigation className="h-4 w-4 text-white" />
                </div>
                <div className="mt-2 text-xs font-medium text-gray-700 text-center max-w-20 truncate">
                  Pickup
                </div>
              </div>
              
              {/* Route Line */}
              <div className="flex-1 mx-4 relative">
                <div className="h-0.5 bg-blue-400 relative">
                  <div className="absolute inset-0 bg-blue-400 animate-pulse"></div>
                </div>
                {distanceKm && durationMin && (
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full shadow-sm">
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Route className="h-3 w-3" />
                      <span>{distanceKm}km</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Dropoff Marker */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div className="mt-2 text-xs font-medium text-gray-700 text-center max-w-20 truncate">
                  Drop-off
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Enter pickup and destination to see route</p>
          </div>
        )}
      </div>
      
      {/* Google Maps Estimate */}
      {pickup && dropoff && (
        <div className="p-4 border-t border-gray-100">
          <EstimatePreview 
            pickup={{ lat: pickup.lat, lng: pickup.lng }}
            dropoff={{ lat: dropoff.lat, lng: dropoff.lng }}
          />
        </div>
      )}
      
      {/* Trip Info */}
      {pickup && dropoff && (
        <div className="p-4 border-t border-gray-100">
          <div className="space-y-3">
            {/* Pickup */}
            <div className="flex items-start space-x-3">
              <Navigation className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Pickup</p>
                <p className="text-sm text-gray-900 truncate">{pickup.description}</p>
              </div>
            </div>
            
            {/* Dropoff */}
            <div className="flex items-start space-x-3">
              <MapPin className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Drop-off</p>
                <p className="text-sm text-gray-900 truncate">{dropoff.description}</p>
              </div>
            </div>
            
            {/* Distance and Duration */}
            {distanceKm && durationMin && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Route className="h-4 w-4" />
                    <span>{distanceKm} km</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{durationMin} min</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPreview;