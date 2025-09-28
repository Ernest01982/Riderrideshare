import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Car, Clock, MapPin, Navigation, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { subscribeTrip, subscribeTripEvents, unsubscribeChannel } from '../lib/realtime';
import { useTripRealtime } from '../hooks/useTripRealtime';
import type { Trip, TripEvent, DispatchMode } from '../lib/supabaseClient';

const TripTracking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const quoteId = searchParams.get('quoteId');
  const tripIdFromUrl = searchParams.get('tripId');

  const { trip, events } = useTripRealtime(tripIdFromUrl);
  const [tripEvents, setTripEvents] = useState<TripEvent[]>([]);
  const [dispatchMode, setDispatchMode] = useState<DispatchMode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let tripsChannel: any;
    let eventsChannel: any;

    const initializeTrip = async () => {
      try {
        setLoading(true);
        setError(null);

        let currentTripId = tripIdFromUrl;

        // If we have a quoteId but no tripId, confirm the quote first
        if (quoteId && !tripIdFromUrl) {
          try {
            const { data: tripData, error: confirmError } = await supabase
              .rpc('app.confirm_trip_from_quote', { p_quote_id: quoteId });

            if (confirmError) {
              if (confirmError.message?.includes('expired')) {
                setError('Quote has expired. Please request a new quote.');
                setTimeout(() => navigate('/'), 3000);
                return;
              }
              throw confirmError;
            }

            currentTripId = tripData;
            
            // Update URL with trip ID
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('tripId', currentTripId);
            newUrl.searchParams.delete('quoteId');
            window.history.replaceState({}, '', newUrl.toString());
          } catch (rpcError) {
            console.error('RPC call failed:', rpcError);
            throw rpcError;
          }
        }

        if (!currentTripId) {
          setError('No trip ID provided');
          return;
        }

        // Fetch initial trip data
        const { data: initialTrip, error: tripError } = await supabase
          .from('trips')
          .select('*')
          .eq('id', currentTripId)
          .single();

        if (tripError) throw tripError;
        setTrip(initialTrip);

        // Fetch initial trip events
        const { data: initialEvents, error: eventsError } = await supabase
          .from('trip_events')
          .select('*')
          .eq('trip_id', currentTripId)
          .order('created_at', { ascending: false });

        if (eventsError) throw eventsError;
        setTripEvents(initialEvents || []);

        // Dispatch the trip if it's still in requested status
        if (initialTrip.status === 'requested') {
          try {
            const { data: mode, error: dispatchError } = await supabase
              .rpc('app.dispatch_trip', { p_trip_id: currentTripId });

            if (dispatchError) {
              console.error('Dispatch error:', dispatchError);
              setDispatchMode('manual'); // Fallback
            } else {
              setDispatchMode(mode);
            }
          } catch (dispatchErr) {
            console.error('Dispatch failed:', dispatchErr);
            setDispatchMode('manual'); // Fallback
          }
        }

        // Set up real-time subscriptions
        tripsChannel = subscribeTrip(currentTripId, (updatedTrip) => {
          setTrip(updatedTrip);
        });

        eventsChannel = subscribeTripEvents(currentTripId, (newEvent) => {
          setTripEvents(prev => [newEvent, ...prev]);
        });

      } catch (err: any) {
        console.error('Trip initialization error:', err);
        setError(err.message || 'Failed to load trip details');
      } finally {
        setLoading(false);
      }
    };

    initializeTrip();

    // Cleanup subscriptions
    return () => {
      unsubscribeChannel(tripsChannel);
      unsubscribeChannel(eventsChannel);
    };
  }, [quoteId, tripIdFromUrl, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'driver_enroute': return 'bg-purple-100 text-purple-800';
      case 'arrived_pickup': return 'bg-green-100 text-green-800';
      case 'on_trip': return 'bg-indigo-100 text-indigo-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getDispatchMessage = () => {
    switch (dispatchMode) {
      case 'manual': return 'An operator will assign a driver shortly.';
      case 'auto': return 'Finding the best nearby driver…';
      case 'offers': return 'Sending offers to nearby drivers…';
      default: return 'Processing your request…';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900">Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Trip not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Trip Tracking</h1>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(trip.status)}`}>
              {getStatusIcon(trip.status)}
              {trip.status.replace('_', ' ')}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Dispatch Status Banner */}
        {trip.status === 'requested' && dispatchMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              {dispatchMode === 'auto' ? (
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              ) : (
                <Clock className="h-5 w-5 text-blue-600" />
              )}
              <div>
                <p className="font-medium text-blue-900">Finding your driver</p>
                <p className="text-sm text-blue-700">{getDispatchMessage()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Trip Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Navigation className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Pickup</p>
                <p className="text-gray-600">{trip.pickup_address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Destination</p>
                <p className="text-gray-600">{trip.dropoff_address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Driver Card */}
        {trip.driver_id && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Driver</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {trip.driver_name || `Driver #${trip.driver_id.slice(-4)}`}
                </p>
                {trip.driver_phone && (
                  <p className="text-sm text-gray-600">{trip.driver_phone}</p>
                )}
              </div>
              {(trip.vehicle_make || trip.vehicle_registration) && (
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Car className="h-4 w-4" />
                    <span>
                      {trip.vehicle_make && trip.vehicle_model 
                        ? `${trip.vehicle_make} ${trip.vehicle_model}`
                        : 'Vehicle'
                      }
                    </span>
                  </div>
                  {trip.vehicle_registration && (
                    <p className="text-xs text-gray-500 mt-1">{trip.vehicle_registration}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trip Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Timeline</h2>
          {tripEvents.length > 0 ? (
            <div className="space-y-4">
              {tripEvents.map((event, index) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                    {index < tripEvents.length - 1 && (
                      <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-gray-900">{event.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No events yet</p>
          )}
        </div>

        {/* Error Fallback */}
        {trip.status === 'requested' && !dispatchMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900">Assignment in progress</p>
                <p className="text-sm text-yellow-700">
                  We'll notify you as soon as a driver is assigned.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TripTracking;