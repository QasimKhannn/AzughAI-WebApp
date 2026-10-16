import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // adjust import if needed

interface PageHeaderProps {
  title: string;
  filterCount?: number;
  onFiltersClick?: () => void;
  className?: string;
  showFilters?: boolean;
  showBackButton?: boolean; // <-- Add this prop
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  filterCount = 0,
  onFiltersClick,
  className = "",
  showFilters = true,
  showBackButton = false // <-- Default to false
}) => {
  const navigate = useNavigate();

  return (
    <div className={`flex justify-between items-center text-lg px-4 py-4 border-0 ${className}`}>
      <div className="flex items-center space-x-2">
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center mt-1 justify-start text-black hover:text-[#AA9C64] transition"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-2xl md:text-2xl text-black lowercase font-manrope tracking-wide">{title}</h1>
      </div>
      {showFilters && (
        <button
          onClick={onFiltersClick}
          className="text-black lowercase hover:text-black/70 transition-colors"
        >
          Filters({filterCount})
        </button>
      )}
    </div>
  );
};

export default PageHeader;
