import React from 'react';
import { CheckCircle, MapPin, Package, Car, User, Phone, Clock, Navigation } from 'lucide-react';
import { BookingType, RideBookingData, PackageBookingData } from '../App';

interface BookingConfirmationProps {
  bookingType: BookingType;
  bookingData: RideBookingData | PackageBookingData;
  onNewBooking: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ 
  bookingType, 
  bookingData, 
  onNewBooking 
}) => {
  const isRideBooking = bookingType === 'ride';
  const bookingId = `RF${Date.now().toString().slice(-6)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRideBooking ? 'Ride Booked!' : 'Pickup Scheduled!'}
          </h1>
          <p className="text-lg text-gray-600">
            {isRideBooking 
              ? 'Your driver will arrive shortly. Track your ride below.' 
              : 'We\'ll pick up your package and notify the recipient.'
            }
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className={`p-4 ${isRideBooking ? 'bg-blue-50' : 'bg-purple-50'}`}>
            <div className="flex items-center space-x-3">
              {isRideBooking ? (
                <Car className="h-6 w-6 text-blue-600" />
              ) : (
                <Package className="h-6 w-6 text-purple-600" />
              )}
              <div>
                <h2 className="font-semibold text-gray-900">Booking #{bookingId}</h2>
                <p className="text-sm text-gray-600">
                  {isRideBooking ? 'Economy ride' : 'Package delivery'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Locations */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Navigation className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {isRideBooking ? 'Pickup' : 'Pickup location'}
                  </p>
                  <p className="text-gray-600">{bookingData.pickup}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {isRideBooking ? 'Destination' : 'Delivery location'}
                  </p>
                  <p className="text-gray-600">{bookingData.destination}</p>
                </div>
              </div>
            </div>

            {/* Service Type */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Service type</span>
                <span className="text-gray-600 capitalize">{bookingData.serviceType}</span>
              </div>
            </div>

            {/* Scheduled Time for Rides */}
            {isRideBooking && (bookingData as RideBookingData).scheduledTime && (
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Scheduled for</p>
                  <p className="text-gray-600">
                    {new Date((bookingData as RideBookingData).scheduledTime!).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Package Details */}
            {!isRideBooking && (
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sender</p>
                    <p className="text-gray-600">{(bookingData as PackageBookingData).senderName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Recipient</p>
                    <p className="text-gray-600">{(bookingData as PackageBookingData).recipientName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Recipient phone</p>
                    <p className="text-gray-600">{(bookingData as PackageBookingData).recipientPhone}</p>
                  </div>
                </div>
                {(bookingData as PackageBookingData).specialInstructions && (
                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-900 mb-1">Special instructions</p>
                    <p className="text-gray-600 text-sm">
                      {(bookingData as PackageBookingData).specialInstructions}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            <div>
              <p className="font-medium text-gray-900">
                {isRideBooking ? 'Finding your driver...' : 'Assigning pickup driver...'}
              </p>
              <p className="text-sm text-gray-600">
                {isRideBooking 
                  ? 'We\'re matching you with the nearest available driver'
                  : 'We\'re finding the best driver for your pickup'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onNewBooking}
          className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:from-gray-900 hover:to-black transition-all duration-200 transform hover:scale-[1.02]"
        >
          Book Another {isRideBooking ? 'Ride' : 'Delivery'}
        </button>
      </main>
    </div>
  );
};

export default BookingConfirmation;