import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-white font-manrope font-medium text-sm sm:text-base">
          {label}
          {required && <span className="text-red-300 ml-1">*</span>}
        </Label>
      )}
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="bg-white/20 border-white/30 !text-white placeholder:!text-white/80 backdrop-blur-sm rounded-xl focus:bg-white/30 focus:border-white/50 transition-all h-12 sm:h-auto text-base ios-input-fix font-manrope"
      />
      {error && (
        <p className="text-red-300 text-xs sm:text-sm mt-1">{error}</p>
      )}
    </div>
  );
};
