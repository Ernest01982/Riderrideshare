import React, { useState } from 'react';
import { Car, Package, ChevronDown, ChevronUp, Clock, Zap, Calendar, AlertTriangle } from 'lucide-react';
import { RideType } from '../../lib/ports/quote';
import { useQuote } from './QuoteContext';
import type { BookingType } from '../../App';

const rideTypes = [
  { id: 'tuktuk' as RideType, name: 'TUK TUK', description: 'Affordable and reliable', icon: Car, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-500' },
  { id: 'tuktuk-xl' as RideType, name: 'TUK TUK XL', description: 'Extra space for 4-6', icon: Car, color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-500' },
  { id: 'delivery' as RideType, name: 'Delivery', description: 'Point to point parcels', icon: Package, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-500' },
];

const packageSizes = [
  { id: 'small', name: 'Small', description: 'Up to 5kg', price: 'R60' },
  { id: 'medium', name: 'Medium', description: 'Up to 20kg', price: 'R95' },
  { id: 'large', name: 'Large', description: 'Up to 50kg', price: 'R165' },
  { id: 'extra-large', name: 'Extra Large', description: 'Up to 100kg', price: 'R250' }
];

export default function EstimateSheet({ serviceType, onGoToPayment }:{ serviceType: BookingType; onGoToPayment: () => void }) {
  const { state, set, requestQuote } = useQuote();

  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Package contact fields (simple local state; you can persist into context later)
  const [packageSize, setPackageSize] = useState('small');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [isFragile, setIsFragile] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const selectedRideType = rideTypes.find(type => type.id === state.rideType);
  const canRequestRide = serviceType === 'package'
    ? Boolean(state.pickup && state.dropoff && !state.loading && contactName && contactPhone)
    : Boolean(state.pickup && state.dropoff && !state.loading);

  const handleRideTypeChange = (rideType: RideType) => {
    set((s: any) => ({ ...s, rideType: rideType === 'tuktuk-xl' ? 'xl' : rideType }));
    if (state.pickup && state.dropoff) requestQuote();
  };

  const handleScheduleToggle = (scheduled: boolean) => {
    setIsScheduled(scheduled);
    if (state.pickup && state.dropoff) requestQuote();
  };

  const handleRequestRide = () => {
    if (canRequestRide && state.quote) onGoToPayment();
  };

  const availableRideTypes = serviceType === 'package'
    ? rideTypes.filter(t => t.id === 'delivery')
    : rideTypes.filter(t => t.id !== 'delivery');

  // If no locations, show helper
  if (!state.pickup && !state.dropoff) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto text-center text-gray-500">
          <Car className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Enter pickup and destination to see estimates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="p-4 space-y-4">
          {/* Ride type */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose option</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableRideTypes.map(type => {
                const isSelected =
                  (state.rideType === 'economy' && type.id === 'tuktuk') ||
                  (state.rideType === 'xl' && type.id === 'tuktuk-xl') ||
                  (state.rideType === 'delivery' && type.id === 'delivery');

                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleRideTypeChange(type.id)}
                    className={`p-4 border-2 rounded-xl text-left transition-all ${isSelected ? `${type.borderColor} ${type.bgColor}` : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{type.name}</div>
                        <div className="text-sm text-gray-600">{type.description}</div>
                      </div>
                      <div className="text-right">
                        {isSelected && state.quote ? (
                          <>
                            <p className="text-lg font-bold text-gray-900">R{state.quote.amount}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {state.quote.durationMin} min
                            </div>
                          </>
                        ) : (
                          <p className="text-lg font-bold text-gray-400">--</p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Package contact details */}
          {serviceType === 'package' && (
            <div className="space-y-4">
              {/* Package Size */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Package size</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {packageSizes.map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setPackageSize(size.id)}
                      className={`p-3 border-2 rounded-xl text-left transition-all ${
                        packageSize === size.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">{size.name}</div>
                          <div className="text-sm text-gray-600">{size.description}</div>
                        </div>
                        <div className="text-lg font-bold text-gray-900">{size.price}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                    placeholder="Contact person name *" 
                    value={contactName} 
                    onChange={e => setContactName(e.target.value)} 
                  />
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                    placeholder="Contact number *" 
                    value={contactPhone} 
                    onChange={e => setContactPhone(e.target.value)} 
                  />
                </div>
                <input 
                  className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                  placeholder="Building/Business name (optional)" 
                  value={buildingName} 
                  onChange={e => setBuildingName(e.target.value)} 
                />
              </div>

              {/* Fragile Option */}
              <div>
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFragile}
                    onChange={(e) => setIsFragile(e.target.checked)}
                    className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <div>
                      <span className="font-medium text-gray-900">Fragile item</span>
                      <p className="text-sm text-gray-600">Extra care handling (+R10)</p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Special Instructions */}
              <div>
                <textarea 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none" 
                  rows={2} 
                  placeholder="Special instructions (optional)" 
                  value={specialInstructions} 
                  onChange={e => setSpecialInstructions(e.target.value)} 
                />
              </div>
            </div>
          )}

          {/* When */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{serviceType === 'package' ? 'When do you need this pickup?' : 'When do you need this ride?'}</h3>
            <div className="flex gap-3">
              <button type="button" onClick={() => handleScheduleToggle(false)} className={`flex-1 p-3 rounded-xl border-2 ${!isScheduled ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                <Zap className="h-5 w-5 mx-auto mb-1" />
                <div className="text-sm font-semibold">Now</div>
              </button>
              <button type="button" onClick={() => handleScheduleToggle(true)} className={`flex-1 p-3 rounded-xl border-2 ${isScheduled ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                <Calendar className="h-5 w-5 mx-auto mb-1" />
                <div className="text-sm font-semibold">Schedule</div>
              </button>
            </div>
            {isScheduled && (
              <input type="datetime-local" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} min={new Date().toISOString().slice(0, 16)} className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            )}
          </div>

          {/* Estimate & breakdown */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {state.quote ? `${state.quote.distanceKm} km • ${state.quote.durationMin} min` : 'Getting estimate…'}
              </div>
              <button type="button" className="text-sm text-blue-600" onClick={() => setShowBreakdown(s => !s)}>
                {showBreakdown ? (<span className="inline-flex items-center gap-1">Hide breakdown <ChevronUp className="h-4 w-4" /></span>) : (<span className="inline-flex items-center gap-1">Show breakdown <ChevronDown className="h-4 w-4" /></span>)}
              </button>
            </div>
            {showBreakdown && state.quote && (
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Base fare</span><span className="text-gray-900">R{state.quote.breakdown.base.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Distance ({state.quote.distanceKm} km)</span><span className="text-gray-900">R{state.quote.breakdown.perKm.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Time ({state.quote.durationMin} min)</span><span className="text-gray-900">R{state.quote.breakdown.perMin.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Service fee</span><span className="text-gray-900">R{state.quote.breakdown.fees.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">VAT (15%)</span><span className="text-gray-900">R{state.quote.breakdown.tax.toFixed(2)}</span></div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold"><span className="text-gray-900">Total</span><span className="text-gray-900">R{state.quote.amount.toFixed(2)}</span></div>
              </div>
            )}
          </div>

          {/* Error */}
          {state.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{state.error}</p>
            </div>
          )}

          {/* Request Now */}
          <button
            onClick={handleRequestRide}
            disabled={!canRequestRide}
            className={`w-full text-white py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 ${serviceType === 'package' ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'}`}
          >
            {state.loading
              ? 'Getting estimate…'
              : state.quote
              ? `Request Now • R${state.quote.amount.toFixed(0)}`
              : (serviceType === 'package'
                  ? 'Enter pickup, destination and contact details to continue'
                  : 'Enter pickup and destination to continue')}
          </button>
        </div>
      </div>
    </div>
  );
}