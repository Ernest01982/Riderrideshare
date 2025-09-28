import React, { useState } from 'react';
import { Package, AlertTriangle, FileText } from 'lucide-react';

interface DeliveryOptionsProps {
  visible: boolean;
}

const packageSizes = [
  { id: 'small', name: 'Small', description: 'Up to 2kg • Envelope, documents', price: 'R60' },
  { id: 'medium', name: 'Medium', description: 'Up to 10kg • Small box, clothing', price: 'R95' },
  { id: 'large', name: 'Large', description: 'Up to 25kg • Large box, electronics', price: 'R165' }
];

const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({ visible }) => {
  const [packageSize, setPackageSize] = useState('small');
  const [isFragile, setIsFragile] = useState(false);
  const [notes, setNotes] = useState('');

  if (!visible) return null;

  return (
    <div className="space-y-4">
      {/* Package Size */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">Package size</h4>
        <div className="space-y-2">
          {packageSizes.map((size) => (
            <button
              key={size.id}
              onClick={() => setPackageSize(size.id)}
              className={`w-full p-3 border-2 rounded-xl transition-all flex items-center justify-between ${
                packageSize === size.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <h5 className="font-semibold text-gray-900">{size.name}</h5>
                  <p className="text-sm text-gray-600">{size.description}</p>
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900">{size.price}</div>
            </button>
          ))}
        </div>
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

      {/* Delivery Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special instructions (optional)
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
            placeholder="Any special delivery instructions, apartment number, gate codes, etc."
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryOptions;