import { ShoppingBag } from "lucide-react";
import { useChatStore } from "../../store/agentStore";
import { useCanvasStore } from "../../store/canvasStore";
import { cn } from "@/lib/utils";

export default function CollectionButton() {
  const { isCanvasOpen, toggleCanvas } = useChatStore();
  const { getAllItems } = useCanvasStore();
  
  const totalItems = getAllItems().length;
  const hasItems = totalItems > 0;

  return (
    <>
      {/* Desktop: Floating button in bottom right */}
      <button
        onClick={toggleCanvas}
        className={cn(
          "hidden lg:flex fixed bottom-6 right-6 z-1",
          "items-center gap-2 px-4 py-3",
          "bg-[#303A2FB2] hover:bg-[#303A2F] text-white",
          "rounded-full shadow-lg",
          "transition-all duration-200",
          "hover:scale-105 active:scale-95",
          "focus:outline-none"
        )}
        aria-label={isCanvasOpen ? "Close collection" : "Open collection"}
      >
        <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
        <span className="text-sm font-medium">Collection</span>
        {hasItems && (
          <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-white text-[#303A2F] rounded-full text-xs font-semibold">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </button>

      {/* Mobile: Floating button in bottom right */}
      <button
        onClick={toggleCanvas}
        className={cn(
          "lg:hidden fixed bottom-20 right-4 z-40",
          "flex items-center justify-center",
          "w-14 h-14",
          "bg-[#303A2FB2] hover:bg-[#303A2F] text-white",
          "rounded-full shadow-lg",
          "transition-all duration-200",
          "active:scale-95",
          "focus:outline-none focus:ring-2 focus:ring-[#303A2F] focus:ring-offset-2"
        )}
        aria-label={isCanvasOpen ? "Close collection" : "Open collection"}
      >
        <div className="relative">
          <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
          {hasItems && (
            <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-white text-[#303A2F] rounded-full text-[10px] font-semibold">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </div>
      </button>
    </>
  );
}
