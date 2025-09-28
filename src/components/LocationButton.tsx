import React, { useState } from 'react';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { getCurrentLocation, getLocationErrorMessage, checkLocationPermission } from '../lib/utils/geolocation';
import { reverseGeocode } from '../lib/services/reverseGeocode';

interface LocationButtonProps {
  onLocationSelect: (location: { description: string; lat: number; lng: number }) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LocationButton: React.FC<LocationButtonProps> = ({ 
  onLocationSelect, 
  disabled = false, 
  className = '',
  size = 'md'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<string | null>(null);

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleLocationRequest = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check permission first
      const permission = await checkLocationPermission();
      setPermissionState(permission);

      if (permission === 'denied') {
        setError('Location access denied. Please enable location permissions in your browser settings.');
        return;
      }

      // Get current location
      const location = await getCurrentLocation();
      
      // Reverse geocode to get address
      const address = await reverseGeocode(location.lat, location.lng);
      
      // Call the callback with the location data
      onLocationSelect({
        description: address.description,
        lat: location.lat,
        lng: location.lng
      });

    } catch (err: any) {
      const errorMessage = getLocationErrorMessage(err);
      setError(errorMessage);
      console.warn('Location request failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleLocationRequest}
        disabled={disabled || isLoading}
        aria-label="Use my current location"
        className={`
          ${sizeClasses[size]} 
          bg-blue-50 hover:bg-blue-100 
          border border-blue-200 hover:border-blue-300 
          rounded-full transition-colors 
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${className}
        `}
      >
        {isLoading ? (
          <Loader2 className={`${iconSizes[size]} text-blue-600 animate-spin`} />
        ) : error ? (
          <AlertCircle className={`${iconSizes[size]} text-red-500`} />
        ) : (
          <MapPin className={`${iconSizes[size]} text-blue-600`} />
        )}
      </button>

      {/* Error tooltip */}
      {error && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg max-w-xs">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-800 font-medium">Location Error</p>
                <p className="text-xs text-red-600 mt-1">{error}</p>
                {permissionState === 'denied' && (
                  <p className="text-xs text-red-600 mt-2">
                    To enable: Click the location icon in your browser's address bar
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="absolute top-1 right-1 p-1 hover:bg-red-100 rounded"
              aria-label="Close error message"
            >
              <AlertCircle className="h-3 w-3 text-red-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationButton;