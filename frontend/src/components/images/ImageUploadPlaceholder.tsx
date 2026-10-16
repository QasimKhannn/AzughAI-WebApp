import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadPlaceholderProps {
  imageUrl?: string;
  onUpload?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function ImageUploadPlaceholder({
  imageUrl,
  onUpload,
  onRemove,
  className,
}: ImageUploadPlaceholderProps) {
  if (imageUrl) {
    return (
      <div
        className={cn(
          "relative flex-1 min-w-0 h-[177px] rounded-lg overflow-hidden group",
          className
        )}
      >
        <img
          src={imageUrl}
          alt="Uploaded"
          className="w-full h-full object-cover"
        />
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute top-1 right-1 z-10 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onUpload}
      className={cn(
        "flex-1 min-w-0 h-[177px] flex items-center justify-center",
        "bg-[#4e2b251a] rounded-lg",
        "cursor-pointer hover:bg-[#4e2b2533] transition-colors",
        className
      )}
      aria-label="Upload photo"
    >
      <Plus className="w-10 h-10 text-[#4e2b25b2]" strokeWidth={1.5} />
    </button>
  );
}
