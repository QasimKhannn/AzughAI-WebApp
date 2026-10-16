import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductUploadPlaceholderProps {
  imageUrl?: string;
  productName?: string;
  onUpload?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function ProductUploadPlaceholder({
  imageUrl,
  productName,
  onUpload,
  onRemove,
  className,
}: ProductUploadPlaceholderProps) {
  if (imageUrl) {
    return (
      <div
        className={cn(
          "relative flex flex-col min-w-0 rounded-lg overflow-hidden group border border-[#4e2b2533]",
          className
        )}
      >
        {/* Image Area */}
        <div className="relative flex-1 aspect-square overflow-hidden bg-[#4e2b251a]">
          <img
            src={imageUrl}
            alt={productName || "Product"}
            className="w-full h-full object-cover"
          />
          {onRemove && (
            <button
              onClick={onRemove}
              className="absolute top-1 right-1 z-10 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove product"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Product Info Area */}
        <div className="px-3 py-2 bg-[#f0edeb] border-t border-[#4e2b2533]">
          <p className="text-sm text-foreground truncate font-light">
            {productName || "Product"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onUpload}
      className={cn(
        "flex flex-col min-w-0 rounded-lg overflow-hidden border border-dashed border-[#4e2b2566]",
        "cursor-pointer hover:border-[#4e2b25] transition-colors",
        className
      )}
      aria-label="Add product"
    >
      {/* Image Placeholder */}
      <div className="flex-1 aspect-square flex items-center justify-center bg-[#4e2b251a]">
        <Plus className="w-10 h-10 text-[#4e2b25b2]" strokeWidth={1.5} />
      </div>
      
      {/* Info Placeholder */}
      <div className="px-3 py-2 bg-[#f0edeb]/50 border-t border-dashed border-[#4e2b2533]">
        <p className="text-sm text-[#4e2b25b2] font-light">
          add item
        </p>
      </div>
    </button>
  );
}
