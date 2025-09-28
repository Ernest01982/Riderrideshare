import React from 'react';
import { Share2, Phone, Shield } from 'lucide-react';

const SafetyStrip: React.FC = () => {
  return (
    <div className="bg-gray-50 border-t border-gray-200 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Your safety matters</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Share Trip */}
            <button
              disabled
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Share trip</span>
            </button>
            
            {/* Emergency */}
            <button
              disabled
              className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>Emergency</span>
            </button>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          Share trip and emergency features will be available during your ride
        </div>
      </div>
    </div>
  );
};

export default SafetyStrip;