import React, { useState } from 'react';
import { ArrowLeft, Navigation, MapPin, CheckCircle } from 'lucide-react';
import { useQuote } from '../features/rider/QuoteContext';
import { supabase } from '../lib/supabaseClient';

interface PaymentProps {
  onBack: () => void;
  onPaymentComplete: () => void;
}

const Payment: React.FC<PaymentProps> = ({ onBack, onPaymentComplete }) => {
  const { state } = useQuote();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (isProcessing) return; // Prevent double-clicks
    setIsProcessing(true);
    
    try {
      // Create trip in database
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please log in to complete payment');
      }

      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          pickup_address: state.pickup!.description,
          dropoff_address: state.dropoff!.description,
          pickup_lat: state.pickup!.lat,
          pickup_lng: state.pickup!.lng,
          dropoff_lat: state.dropoff!.lat,
          dropoff_lng: state.dropoff!.lng,
          distance_km: state.quote!.distanceKm,
          duration_min: state.quote!.durationMin,
          amount: state.quote!.amount,
          total_amount: state.quote!.amount,
          status: 'requested',
          payment_method: paymentMethod
        })
        .select()
        .single();

      if (tripError) throw tripError;

      onPaymentComplete();
    } catch (error) {
      console.error('Payment processing error:', error);
      setError(error instanceof Error ? error.message : 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!state.quote || !state.pickup || !state.dropoff) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <p className="text-gray-600">Missing trip details.</p>
          <button onClick={onBack} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <button 
              onClick={onBack} 
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Confirm & Pay</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Trip summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Trip summary</h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Navigation className="h-5 w-5 text-green-500 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Pickup</p>
                <p className="text-sm text-gray-900">{state.pickup.description}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Destination</p>
                <p className="text-sm text-gray-900">{state.dropoff.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <div className="text-xs text-gray-500">Distance</div>
              <div className="font-semibold">{state.quote.distanceKm} km</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <div className="text-xs text-gray-500">Time</div>
              <div className="font-semibold">{state.quote.durationMin} min</div>
            </div>
          </div>

          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Base fare</span><span className="text-gray-900">R{state.quote.breakdown.base.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Distance</span><span className="text-gray-900">R{state.quote.breakdown.perKm.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Time</span><span className="text-gray-900">R{state.quote.breakdown.perMin.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Service fee</span><span className="text-gray-900">R{state.quote.breakdown.fees.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">VAT (15%)</span><span className="text-gray-900">R{state.quote.breakdown.tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold border-t pt-2"><span>Total</span><span>R{state.quote.amount.toFixed(2)}</span></div>
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment method</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setPaymentMethod('card')} className={`p-3 rounded-xl border-2 ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}>Card</button>
            <button onClick={() => setPaymentMethod('cash')} className={`p-3 rounded-xl border-2 ${paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}>Cash</button>
          </div>
          <p className="mt-3 text-xs text-gray-500">Front-end only: no real processing yet.</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Confirm & Pay */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Processing Payment…</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Confirm & Pay R{state.quote.amount.toFixed(2)}</span>
            </div>
          )}
        </button>
      </main>
    </div>
  );
};

export default Payment;