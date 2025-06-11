import React from 'react';

interface InputProps {
  label?: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  width?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  type = 'text' , 
  placeholder = '',
  error = '',
  disabled = false,
  width = '150px',
  onFocus,
  onBlur
}) => {
  return (
    <div className={`mb-4`} style={{ width }}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-3 py-2 text-gray-900 border rounded-md shadow-sm
          focus:outline-none focus:ring-1 focus:ring-gray-500
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-500'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
      />

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
