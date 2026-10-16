import React from 'react';
import { ChevronRight } from 'lucide-react';

interface MenuItemProps {
  icon?: React.ReactNode;
  text: string;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, text, onClick }) => {
  return (
    <div 
      className="flex items-center justify-between py-4 px-4 hover:bg-muted/50 rounded-lg cursor-pointer transition-all duration-200 group"
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        {icon && (
          <div className="text-muted-foreground group-hover:text-foreground transition-colors">
            {icon}
          </div>
        )}
        <span className="text-foreground font-light group-hover:text-foreground transition-colors">{text}</span>
      </div>
      <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors font-light" />
    </div>
  );
};

export default MenuItem;
