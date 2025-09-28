import React, { useState } from 'react';
import { ArrowLeft, Package, MapPin, Navigation, User, Phone, FileText, Clock, Zap } from 'lucide-react';
import { PackageBookingData } from '../App';
import LocationInput from './LocationInput';

interface PackageBookingProps {
  onComplete: (data: PackageBookingData) => void;
  onBack: () => void;
}

const packageTypes = [
  { id: 'small', name: 'Small Package', description: 'Up to 2kg • Envelope, documents', price: 'R60' },
  { id: 'medium', name: 'Medium Package', description: 'Up to 10kg • Small box, clothing', price: 'R95' },
  { id: 'large', name: 'Large Package', description: 'Up to 25kg • Large box, electronics', price: 'R165' }
];

const PackageBooking: React.FC<PackageBookingProps> = ({ onComplete, onBack }) => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [packageType, setPackageType] = useState('small');
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !destination || !senderName || !recipientName || !recipientPhone) return;

    const bookingData: PackageBookingData = {
      pickup,
      destination,
      packageType,
      senderName,
      recipientName,
      recipientPhone,
      ...(specialInstructions ? { specialInstructions } : {}),
      ...(isScheduled && scheduledTime ? { scheduledTime } : {})
    };

    onComplete(bookingData);
  };

  const selectedPackage = packageTypes.find(pkg => pkg.id === packageType)!;

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
            <h1 className="text-xl font-semibold text-gray-900">Send a Package</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Inputs */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pickup & Delivery</h2>
            <div className="space-y-4">
              <LocationInput
                label="Pickup location"
                value={pickup}
                onChange={setPickup}
                icon={<Navigation className="h-5 w-5 text-green-500" />}
                placeholder="Where should we pick up the package?"
              />
              <LocationInput
                label="Delivery location"
                value={destination}
                onChange={setDestination}
                icon={<MapPin className="h-5 w-5 text-red-500" />}
                placeholder="Where should we deliver it?"
              />
            </div>
          </div>

          {/* Package Type */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Package size</h2>
            <div className="space-y-3">
              {packageTypes.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    packageType === pkg.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPackageType(pkg.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Package className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                        <p className="text-sm text-gray-600">{pkg.description}</p>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-gray-900">{pkg.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sender name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Recipient's full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient phone number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Special instructions (optional)</h2>
            <div className="relative">
              <FileText className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={3}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                placeholder="Any special delivery instructions, apartment number, gate codes, etc."
              />
            </div>
          </div>

          {/* Schedule Options */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">When do you need this pickup?</h2>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setIsScheduled(false)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  !isScheduled
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
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
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
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
                  Select pickup date and time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  min={new Date().toISOString().slice(0, 16)}
                />
                {scheduledTime && (
                  <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">
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
            disabled={!pickup || !destination || !senderName || !recipientName || !recipientPhone}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
          >
            Schedule Pickup • {selectedPackage.price}
          </button>
        </form>
      </main>
    </div>
  );
};

export default PackageBooking;