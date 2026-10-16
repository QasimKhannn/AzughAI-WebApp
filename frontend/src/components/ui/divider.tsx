import React from 'react';

interface DividerProps {
  text?: string;
  className?: string;
  borderColor?: string;
  textColor?: string;
  fontStyle?: string;
}

export const Divider: React.FC<DividerProps> = ({ 
  text = "or continue with", 
  className = "", 
  borderColor = "border-white/60",
  textColor = "text-white",
  fontStyle = "uppercase"
}) => {
  return (
    <div className={`flex items-center py-2 ${className}`}>
      <span className={`flex-1 border-t ${borderColor}`} />
      <span className={`px-3 text-xs ${fontStyle} ${textColor} font-manrope`}>
        {text}
      </span>
      <span className={`flex-1 border-t ${borderColor}`} />
    </div>
  );
};
