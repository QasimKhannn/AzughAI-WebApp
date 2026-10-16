import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KeyWordsProps {
  icon: LucideIcon;
  label: string;
  className?: string;
}

export default function KeyWords({ icon: Icon, label, className }: KeyWordsProps) {
  return (
    <div
      className={cn(
        "group inline-flex items-center gap-2 px-4 py-2 xl:px-5",
        "rounded-full bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md",
        "text-[#2a2a2a] text-xs xl:text-sm font-light",
        "border border-[#AA9C64]/20 shadow-sm",
        "hover:shadow-md hover:border-[#AA9C64]/40 transition-all duration-300",
        className
      )}
    >
      <div className="p-1 rounded-full bg-[#AA9C64]/10 group-hover:bg-[#AA9C64]/20 transition-colors duration-300">
        <Icon className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-[#AA9C64]" />
      </div>
      <span className="lowercase">{label}</span>
    </div>
  );
}
