import React from 'react';
import { ArrowLeft, MapPin, Navigation, Clock, CreditCard, Receipt, User, Car } from 'lucide-react';

interface RideHistoryProps {
  onBack: () => void;
}

interface RideRecord {
  id: string;
  date: string;
  time: string;
  pickupLocation: string;
  dropoffLocation: string;
  distance: number;
  subtotal: number;
  vat: number;
  totalCost: number;
  status: 'completed' | 'cancelled';
  driverName?: string;
  vehicleRegistration?: string;
}

// Mock data - in a real app, this would come from your backend/database
const mockRideHistory: RideRecord[] = [
  {
    id: 'RF123456',
    date: '2025-01-15',
    time: '14:30',
    pickupLocation: 'V&A Waterfront, Cape Town',
    dropoffLocation: 'Cape Town International Airport',
    distance: 22.5,
    subtotal: 306.25,
    vat: 45.94,
    totalCost: 352.19,
    status: 'completed',
    driverName: 'Sipho Mthembu',
    vehicleRegistration: 'CA 123-456'
  },
  {
    id: 'RF123455',
    date: '2025-01-14',
    time: '09:15',
    pickupLocation: 'Sea Point Promenade',
    dropoffLocation: 'Cape Town CBD',
    distance: 8.2,
    subtotal: 127.50,
    vat: 19.13,
    totalCost: 146.63,
    status: 'completed',
    driverName: 'Nomsa Dlamini',
    vehicleRegistration: 'CA 789-012'
  },
  {
    id: 'RF123454',
    date: '2025-01-12',
    time: '18:45',
    pickupLocation: 'Camps Bay Beach',
    dropoffLocation: 'Stellenbosch University',
    distance: 45.8,
    subtotal: 597.50,
    vat: 89.63,
    totalCost: 687.13,
    status: 'completed',
    driverName: 'Thabo Molefe',
    vehicleRegistration: 'CA 345-678'
  },
  {
    id: 'RF123453',
    date: '2025-01-10',
    time: '12:20',
    pickupLocation: 'Table Mountain Cableway',
    dropoffLocation: 'Green Point Stadium',
    distance: 6.5,
    subtotal: 106.25,
    vat: 15.94,
    totalCost: 122.19,
    status: 'completed',
    driverName: 'Zanele Khumalo',
    vehicleRegistration: 'CA 901-234'
  },
  {
    id: 'RF123452',
    date: '2025-01-08',
    time: '16:10',
    pickupLocation: 'Kirstenbosch Botanical Gardens',
    dropoffLocation: 'Muizenberg Beach',
    distance: 18.3,
    subtotal: 253.75,
    vat: 38.06,
    totalCost: 291.81,
    status: 'cancelled',
    driverName: 'Mandla Ndaba',
    vehicleRegistration: 'CA 567-890'
  }
];

const RideHistory: React.FC<RideHistoryProps> = ({ onBack }) => {
  const completedRides = mockRideHistory.filter(ride => ride.status === 'completed');
  const totalSpent = completedRides.reduce((sum, ride) => sum + ride.totalCost, 0);
  const totalDistance = completedRides.reduce((sum, ride) => sum + ride.distance, 0);

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
                <p className="text-2xl font-bold text-gray-900">{completedRides.length}</p>
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

        {/* Ride History List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Rides</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {mockRideHistory.map((ride) => (
              <div key={ride.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Date and Time */}
                    <div className="flex items-center space-x-2 mb-3">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(`${ride.date}T${ride.time}`).toLocaleDateString('en-ZA', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })} at {ride.time}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ride.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {ride.status === 'completed' ? 'Completed' : 'Cancelled'}
                      </span>
                    </div>

                    {/* Locations */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start space-x-3">
                        <Navigation className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Pickup</p>
                          <p className="text-sm text-gray-900">{ride.pickupLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Drop-off</p>
                          <p className="text-sm text-gray-900">{ride.dropoffLocation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Distance:</span> {ride.distance} km
                      </div>
                      <div>
                        <span className="font-medium">Ride ID:</span> {ride.id}
                      </div>
                    </div>

                    {/* Driver and Vehicle Info */}
                    {ride.status === 'completed' && ride.driverName && ride.vehicleRegistration && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <div>
                              <span className="font-medium">Driver:</span> {ride.driverName}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4 text-gray-500" />
                            <div>
                              <span className="font-medium">Vehicle:</span> {ride.vehicleRegistration}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cost Breakdown */}
                  {ride.status === 'completed' && (
                    <div className="ml-6 text-right">
                      <div className="bg-gray-50 rounded-lg p-4 min-w-[200px]">
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="text-gray-900">R{ride.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">VAT (15%):</span>
                            <span className="text-gray-900">R{ride.vat.toFixed(2)}</span>
                          </div>
                          <div className="border-t border-gray-200 pt-1 mt-2">
                            <div className="flex justify-between font-semibold">
                              <span className="text-gray-900">Total:</span>
                              <span className="text-gray-900">R{ride.totalCost.toFixed(2)}</span>
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

        {mockRideHistory.length === 0 && (
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