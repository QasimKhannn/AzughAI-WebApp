import React from 'react';
import { Switch } from '@/components/ui/switch';

interface ToggleItemProps {
  icon: React.ReactNode;
  text: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleItem: React.FC<ToggleItemProps> = ({ icon, text, description, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between py-4 px-4 rounded-lg border-b border-border last:border-b-0">
      <div className="flex items-center space-x-3 flex-1">
        <div className="text-muted-foreground">
          {icon}
        </div>
        <div className="flex-1">
          <span className="text-foreground font-medium block">{text}</span>
          <span className="text-muted-foreground text-sm mt-1 block">{description}</span>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} className="ml-4" />
    </div>
  );
};

export default ToggleItem;
