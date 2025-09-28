import React from 'react';
import { Car, ArrowLeft } from 'lucide-react';
import { useQuote } from '../features/rider/QuoteContext';
import AddressInput from '../features/rider/AddressInput';
import SavedPlaces from '../features/rider/SavedPlaces';
import MapPreview from '../features/rider/MapPreview';
import EstimateSheet from '../features/rider/EstimateSheet';
import DeliveryOptions from '../features/rider/DeliveryOptions';
import SafetyStrip from '../features/rider/SafetyStrip';
import { BookingType } from '../App';

interface RiderProps {
  serviceType: BookingType;
  onBack: () => void;
  onGoToPayment: () => void;
}

const RiderUI: React.FC<{ serviceType: BookingType; onGoToPayment: () => void }> = ({ serviceType, onGoToPayment }) => {
  const { state, set } = useQuote();

  const handlePickupChange = (point?: { description: string; lat: number; lng: number }) =>
    set((s: any) => ({ ...s, pickup: point }));

  const handleDropoffChange = (point?: { description: string; lat: number; lng: number }) =>
    set((s: any) => ({ ...s, dropoff: point }));

  const handleSavedPlaceSelect = (place: { description: string; lat: number; lng: number }) =>
    handlePickupChange(place); // simple default

  React.useEffect(() => {
    if (serviceType === 'package') set((s: any) => ({ ...s, rideType: 'delivery' }));
  }, [serviceType, set]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6 pb-96">
        <AddressInput
          pickup={state.pickup}
          dropoff={state.dropoff}
          onPickupChange={handlePickupChange}
          onDropoffChange={handleDropoffChange}
        />

        <SavedPlaces onPlaceSelect={handleSavedPlaceSelect} />

        <MapPreview
          pickup={state.pickup}
          dropoff={state.dropoff}
          distanceKm={state.quote?.distanceKm}
          durationMin={state.quote?.durationMin}
        />
      </main>

      <EstimateSheet serviceType={serviceType} onGoToPayment={onGoToPayment} />
      <SafetyStrip />
    </div>
  );
};

const Rider: React.FC<RiderProps> = ({ serviceType, onBack, onGoToPayment }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <button onClick={onBack} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Car className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {serviceType === 'ride' ? 'Book a Ride' : 'Send a Package'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <RiderUI serviceType={serviceType} onGoToPayment={onGoToPayment} />
    </div>
  );
};

export default Rider;