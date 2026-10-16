import { useState, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Info, Trash2 } from "lucide-react";
import {cn} from "@/lib/utils";

interface ConversationItemProps {
  id: string;
  title: string;
  isSelected?: boolean;
  onRename?: (id: string, newTitle: string) => void;
  onDetails?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  className?: string;
}

interface ActionItemProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

function ActionItem({ icon: Icon, label, onClick, variant = "default" }: ActionItemProps) {
  const isDanger = variant === "danger";

  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:!bg-[#e3dfd8]/50 ${
        isDanger
          ? "text-red-500 hover:text-red-600 focus:text-red-600"
          : "text-foreground/70 hover:text-foreground"
      }`}
    >
      <Icon size={16} strokeWidth={1.5} className={isDanger ? "text-red-400" : "text-foreground/50"} />
      <span className="font-light text-sm">{label}</span>
    </DropdownMenuItem>
  );
}

export default function ConversationItem({
  id,
  title,
  isSelected = false,
  onRename,
  onDetails,
  onDelete,
  onClick,
  className,
}: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Move cursor to the end of the input
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleStartRename = () => {
    setEditValue(title);
    setIsEditing(true);
  };

  const handleFinishRename = () => {
    setIsEditing(false);
    if (editValue.trim() && editValue !== title) {
      onRename?.(id, editValue.trim());
    } else {
      setEditValue(title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleFinishRename();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(title);
    }
  };

  return (
    <div
      onClick={() => !isEditing && onClick?.(id)}
      className={cn(
        "flex items-center justify-between px-4 py-3 cursor-pointer rounded-md transition-colors",
        isSelected
          ? "bg-[#e3dfd8]/50"
          : "hover:bg-[#e3dfd8]/30",
        className
      )}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleFinishRename}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="font-light text-foreground/80 text-sm flex-1 mr-2 bg-transparent border-0 border-b border-foreground/30 outline-none focus:border-foreground/50 py-0"
        />
      ) : (
        <span className="font-light text-foreground/80 text-sm truncate flex-1 mr-2">
          {title || "Untitled conversation"}
        </span>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1 hover:bg-[#e3dfd8]/50 rounded-md focus:outline-none"
          >
            <MoreVertical size={16} strokeWidth={1.5} className="text-foreground/50" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] rounded-md">
          <ActionItem
            icon={Pencil}
            label="Rename"
            onClick={handleStartRename}
          />
          <ActionItem
            icon={Info}
            label="Details"
            onClick={() => onDetails?.(id)}
          />
          <ActionItem
            icon={Trash2}
            label="Delete"
            onClick={() => onDelete?.(id)}
            variant="danger"
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
