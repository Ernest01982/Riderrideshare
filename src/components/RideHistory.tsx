import React from 'react';
import { ArrowLeft, MapPin, Navigation, Clock, CreditCard, Receipt, User, Car } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface RideHistoryProps {
  onBack: () => void;
}

interface Trip {
  id: string;
  created_at: string;
  pickup_address: string;
  dropoff_address: string;
  distance_km?: number;
  amount?: number;
  vat_amount?: number;
  total_amount?: number;
  status: 'completed' | 'cancelled' | 'requested' | 'assigned' | 'driver_enroute' | 'arrived_pickup' | 'on_trip';
  driver_name?: string;
  vehicle_registration?: string;
}

const RideHistory: React.FC<RideHistoryProps> = ({ onBack }) => {
  const [trips, setTrips] = React.useState<Trip[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('Please log in to view your ride history');
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('trips')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (fetchError) throw fetchError;
        setTrips(data || []);
      } catch (err: any) {
        console.error('Failed to fetch trip history:', err);
        setError(err.message || 'Failed to load trip history');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const completedTrips = trips.filter(trip => trip.status === 'completed');
  const totalSpent = completedTrips.reduce((sum, trip) => sum + (trip.total_amount || 0), 0);
  const totalDistance = completedTrips.reduce((sum, trip) => sum + (trip.distance_km || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Ride History</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Rides</p>
                <p className="text-2xl font-bold text-gray-900">{completedTrips.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Distance</p>
                <p className="text-2xl font-bold text-gray-900">{totalDistance.toFixed(1)} km</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">R{totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your ride history...</p>
          </div>
        )}

        {error && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load history</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        )}

        {/* Ride History List */}
        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Rides</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {trips.map((trip) => (
              <div key={trip.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Date and Time */}
                    <div className="flex items-center space-x-2 mb-3">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(trip.created_at).toLocaleDateString('en-ZA', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })} at {new Date(trip.created_at).toLocaleTimeString('en-ZA', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        trip.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {trip.status === 'completed' ? 'Completed' : trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                      </span>
                    </div>

                    {/* Locations */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start space-x-3">
                        <Navigation className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Pickup</p>
                          <p className="text-sm text-gray-900">{trip.pickup_address}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Drop-off</p>
                          <p className="text-sm text-gray-900">{trip.dropoff_address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      {trip.distance_km && (
                        <div>
                          <span className="font-medium">Distance:</span> {trip.distance_km} km
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Trip ID:</span> {trip.id.slice(-8)}
                      </div>
                    </div>

                    {/* Driver and Vehicle Info */}
                    {trip.status === 'completed' && trip.driver_name && trip.vehicle_registration && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <div>
                              <span className="font-medium">Driver:</span> {trip.driver_name}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4 text-gray-500" />
                            <div>
                              <span className="font-medium">Vehicle:</span> {trip.vehicle_registration}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cost Breakdown */}
                  {trip.status === 'completed' && trip.total_amount && (
                    <div className="ml-6 text-right">
                      <div className="bg-gray-50 rounded-lg p-4 min-w-[200px]">
                        <div className="space-y-1 text-sm">
                          {trip.amount && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="text-gray-900">R{trip.amount.toFixed(2)}</span>
                            </div>
                          )}
                          {trip.vat_amount && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">VAT (15%):</span>
                              <span className="text-gray-900">R{trip.vat_amount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="border-t border-gray-200 pt-1 mt-2">
                            <div className="flex justify-between font-semibold">
                              <span className="text-gray-900">Total:</span>
                              <span className="text-gray-900">R{trip.total_amount.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {!loading && !error && trips.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No rides yet</h3>
            <p className="text-gray-600">Your ride history will appear here after you complete your first trip.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default RideHistory;