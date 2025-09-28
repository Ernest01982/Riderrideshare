import React, { useState } from 'react';
import { ArrowLeft, MapPin, Navigation, Clock, Car, Users, Zap, Calculator } from 'lucide-react';
import { RideBookingData } from '../App';
import LocationInput from './LocationInput';

interface RideBookingProps {
  onComplete: (data: RideBookingData) => void;
  onBack: () => void;
}

const rideTypes = [
  {
    id: 'tuktuk',
    name: 'TUK TUK',
    description: 'Affordable and reliable TUK TUK rides',
    ratePerKm: 12.50,
    baseFare: 25,
    time: '3-7 min',
    icon: Car,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  }
];

const RideBooking: React.FC<RideBookingProps> = ({ onComplete, onBack }) => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [serviceType, setServiceType] = useState('tuktuk');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [estimatedDistance, setEstimatedDistance] = useState<number | null>(null);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !destination) return;

    const bookingData: RideBookingData = {
      pickup,
      destination,
      serviceType,
      ...(isScheduled && scheduledTime ? { scheduledTime } : {})
    };

    onComplete(bookingData);
  };

  const selectedRide = rideTypes.find(ride => ride.id === serviceType)!;
  
  const calculateEstimate = (rideType: typeof rideTypes[0], distance: number) => {
    return rideType.baseFare + (rideType.ratePerKm * distance);
  };

  // This function will be called when Google Maps API calculates the distance
  const handleDistanceCalculated = (distance: number) => {
    setEstimatedDistance(distance);
    setIsCalculatingDistance(false);
  };

  // Simulate distance calculation for now (you'll replace this with Google Maps API)
  const simulateDistanceCalculation = () => {
    if (!pickup || !destination) return;
    
    setIsCalculatingDistance(true);
    // Simulate API call delay
    setTimeout(() => {
      // Mock distance calculation (you'll replace this with actual Google Maps API)
      const mockDistance = Math.random() * 20 + 5; // Random distance between 5-25 km
      handleDistanceCalculated(mockDistance);
    }, 1500);
  };

  // Trigger distance calculation when both locations are filled
  React.useEffect(() => {
    if (pickup && destination) {
      simulateDistanceCalculation();
    } else {
      setEstimatedDistance(null);
      setIsCalculatingDistance(false);
    }
  }, [pickup, destination]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Book a Ride</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Inputs */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Where to?</h2>
              <div className="space-y-4">
                <LocationInput
                  label="Pickup location"
                  value={pickup}
                  onChange={setPickup}
                  icon={<Navigation className="h-5 w-5 text-green-500" />}
                  placeholder="Enter pickup address"
                />
                <LocationInput
                  label="Destination"
                  value={destination}
                  onChange={setDestination}
                  icon={<MapPin className="h-5 w-5 text-red-500" />}
                  placeholder="Where are you going?"
                />
              </div>
            </div>
          </div>

          {/* Ride Estimate */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calculator className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Your TUK TUK Ride Estimate</h2>
            </div>
            
            {isCalculatingDistance && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-gray-600">Calculating distance and fare...</p>
              </div>
            )}
            
            {estimatedDistance && !isCalculatingDistance && (
              <div className="mb-4 p-4 bg-blue-50 rounded-xl">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Estimated distance:</span>
                  <span className="font-semibold text-gray-900">{estimatedDistance.toFixed(1)} km</span>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              {rideTypes.map((ride) => {
                const estimatedPrice = estimatedDistance 
                  ? calculateEstimate(ride, estimatedDistance)
                  : null;
                
                return (
                <div
                  key={ride.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    serviceType === ride.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setServiceType(ride.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full ${ride.bgColor} flex items-center justify-center`}>
                        <ride.icon className={`h-6 w-6 ${ride.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{ride.name}</h3>
                        <p className="text-sm text-gray-600">{ride.description}</p>
                        <p className="text-xs text-gray-500 mt-1">R{ride.ratePerKm}/km + R{ride.baseFare} base</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {estimatedPrice ? (
                        <p className="text-lg font-bold text-gray-900">R{estimatedPrice.toFixed(0)}</p>
                      ) : (
                        <p className="text-lg font-bold text-gray-400">--</p>
                      )}
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {ride.time}
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
            
            {!pickup || !destination ? (
              <p className="text-sm text-gray-500 mt-4 text-center">
                Enter pickup and destination to see fare estimates
              </p>
            ) : null}
          </div>

          {/* Schedule Options */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">When do you need this ride?</h2>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setIsScheduled(false)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  !isScheduled
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <Zap className="h-5 w-5 mx-auto mb-2" />
                <div className="text-sm font-semibold">Now</div>
              </button>
              <button
                type="button"
                onClick={() => setIsScheduled(true)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  isScheduled
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <Clock className="h-5 w-5 mx-auto mb-2" />
                <div className="text-sm font-semibold">Schedule</div>
              </button>
            </div>
            
            {isScheduled && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select date and time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={new Date().toISOString().slice(0, 16)}
                />
                {scheduledTime && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Pickup time: {new Date(scheduledTime).toLocaleString('en-ZA', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Book Button */}
          <button
            type="submit"
            disabled={!pickup || !destination}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
          >
            {estimatedDistance && !isCalculatingDistance
              ? `Book TUK TUK Ride • R${calculateEstimate(selectedRide, estimatedDistance).toFixed(0)}`
              : `Book TUK TUK Ride`
            }
          </button>
        </form>
      </main>
    </div>
  );
};

export default RideBooking;