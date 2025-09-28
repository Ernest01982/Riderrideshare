import React from 'react';

interface LocationInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  placeholder: string;
}

const LocationInput: React.FC<LocationInputProps> = ({ 
  label, 
  value, 
  onChange, 
  icon, 
  placeholder 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {icon}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  );
};

export default LocationInput;