export interface LocationResult {
  lat: number;
  lng: number;
  accuracy: number;
}

export interface LocationError {
  code: number;
  message: string;
}

export const LOCATION_ERRORS = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
  NOT_SUPPORTED: 4,
} as const;

export const getLocationErrorMessage = (error: LocationError): string => {
  switch (error.code) {
    case LOCATION_ERRORS.PERMISSION_DENIED:
      return 'Location access denied. Please enable location permissions in your browser settings.';
    case LOCATION_ERRORS.POSITION_UNAVAILABLE:
      return 'Location information is unavailable. Please try again or enter your address manually.';
    case LOCATION_ERRORS.TIMEOUT:
      return 'Location request timed out. Please try again or enter your address manually.';
    case LOCATION_ERRORS.NOT_SUPPORTED:
      return 'Geolocation is not supported by this browser. Please enter your address manually.';
    default:
      return 'Unable to get your location. Please enter your address manually.';
  }
};

export const getCurrentLocation = (): Promise<LocationResult> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: LOCATION_ERRORS.NOT_SUPPORTED,
        message: 'Geolocation is not supported by this browser'
      });
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject({
          code: error.code,
          message: error.message
        });
      },
      options
    );
  });
};

export const checkLocationPermission = async (): Promise<'granted' | 'denied' | 'prompt' | 'unsupported'> => {
  if (!navigator.permissions) {
    return 'unsupported';
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state;
  } catch (error) {
    console.warn('Permission query failed:', error);
    return 'unsupported';
  }
};