import React from 'react';
import { Car, Package, MapPin, Clock, Shield, Star, History, Navigation } from 'lucide-react';
import { BookingType } from '../App';
import LocationButton from './LocationButton';

interface ServiceSelectionProps {
  onServiceSelect: (type: BookingType) => void;
  onViewHistory: () => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ onServiceSelect, onViewHistory }) => {
  const handleLocationSelect = (location: { description: string; lat: number; lng: number }) => {
    // Store location in localStorage for use in booking flow
    localStorage.setItem('rideflow_current_location', JSON.stringify(location));
    console.log('Current location saved:', location);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Car className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">RideFlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                Cape Town, SA
              </div>
              <LocationButton
                onLocationSelect={handleLocationSelect}
                size="sm"
                className="bg-white hover:bg-gray-50 border-gray-200"
              />
              <button
                onClick={onViewHistory}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <History className="h-4 w-4" />
                <span>History</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What can we help you with today?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our reliable services to get where you need to go or send what you need to deliver.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Ride Service */}
          <div 
            onClick={() => onServiceSelect('ride')}
            className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <Car className="h-12 w-12" />
                <div className="text-right">
                  <div className="text-sm opacity-90">Starting from</div>
                  <div className="text-2xl font-bold">R85</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Request a Ride</h3>
              <p className="text-blue-100">Get a reliable ride to your destination</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">Average wait: 3-7 minutes</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Shield className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">Insured and background-checked drivers</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Star className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">4.9 average rating</span>
                </div>
              </div>
            </div>
            
            {/* Book Now Button */}
            <div className="p-6 pt-0">
              <button
                onClick={() => onServiceSelect('ride')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              >
                Book Now
              </button>
            </div>
          </div>

          {/* Package Service */}
          <div 
            onClick={() => onServiceSelect('package')}
            className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105"
          >
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <Package className="h-12 w-12" />
                <div className="text-right">
                  <div className="text-sm opacity-90">Starting from</div>
                  <div className="text-2xl font-bold">R60</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Send a Package</h3>
              <p className="text-purple-100">Fast and secure package delivery</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-purple-500" />
                  <span className="text-sm">Same-day delivery available</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Shield className="h-4 w-4 mr-2 text-purple-500" />
                  <span className="text-sm">Real-time tracking included</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Package className="h-4 w-4 mr-2 text-purple-500" />
                  <span className="text-sm">Up to 100kg supported</span>
                </div>
              </div>
            </div>
            
            {/* Book Now Button */}
            <div className="p-6 pt-0">
              <button
                onClick={() => onServiceSelect('package')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose RideFlow?</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Safe & Secure</h4>
              <p className="text-gray-600 text-sm">All drivers are background checked and vehicles are regularly inspected</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Always On Time</h4>
              <p className="text-gray-600 text-sm">Real-time tracking and reliable ETAs you can count on</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">5-Star Service</h4>
              <p className="text-gray-600 text-sm">Consistently rated as the best ride and delivery service in the city</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceSelection;