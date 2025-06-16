import React, { useState } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  onChange: (value: string) => void;
  value: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  onChange,
  value,
  disabled,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  const inputClasses = `
    w-full px-3 py-2 text-gray-900 bg-white border rounded-md
    transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-0
    ${error ? 'border-red-500' : 'border-gray-300 focus:border-gray-500'}
    ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-gray-400'}
    ${icon ? 'pl-10' : ''}
    ${className}
  `;
  
  const labelClasses = `
    absolute left-3 transition-all duration-200 pointer-events-none text-gray-500
    ${focused || value ? 'top-0 text-xs bg-white px-1 -mt-2' : 'top-2 text-base'}
  `;
  
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-2.5 text-gray-400 pointer-events-none">
          {icon}
        </div>
      )}
      
      <input
        className={inputClasses}
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        {...props}
      />
      
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};