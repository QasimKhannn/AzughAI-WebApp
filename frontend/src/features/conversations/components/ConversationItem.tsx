import React from "react";
import { useNavigate } from "react-router-dom";
import { ConvoItemProps } from "../types";
import ImageIcon from "@/components/icons/ImageIcon";

interface ExtendedConvoItemProps extends ConvoItemProps {
  isMobile: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

const ConversationItem: React.FC<ExtendedConvoItemProps> = ({
  id,
  title,
  subtitle,
  date,
  stats,
  onDelete,
  onOpen,
  onSelect,
  isSelected = false,
  isMobile,
  closet,
  wishlist,
  cart,
  disliked,
}) => {
  const navigate = useNavigate();

  const handleOpen = () => {
    if (onOpen) {
      onOpen();
    } else if (isMobile) {
      navigate(`/convo-summary/${id}`, {
        state: { title, subtitle, date, stats, closet, wishlist, cart, disliked },
      });
    } else if (onSelect) {
      onSelect();
    }
  };

  // Mobile layout
  if (isMobile) {
    return (
      <div
        className="w-full gap-2 flex flex-col justify-start px-4 pt-4 border-b border-black items-start cursor-pointer hover:bg-gray-50 transition"
        onClick={handleOpen}
        tabIndex={0}
        role="button"
      >
        <h2 className="font-light font-manrope capitalize">{title}</h2>
        <div className="flex justify-between w-full items-start">
          <p className="font-manrope font-semibold text-sm">{date}{stats && ` · ${stats}`}</p>
          <div
            className="flex justify-center items-center gap-4 mb-5"
            onClick={e => e.stopPropagation()}
          >
              <ImageIcon name="delete.svg" onClick={onDelete} alt="Delete" width={20} height={20} />
              <ImageIcon name="expand.svg" onClick={handleOpen} alt="Open" width={20} height={20} />
          </div>
        </div>
      </div>
    );
  }

  // Desktop sidebar item layout
  return (
    <div
      className={`w-full gap-2 flex flex-col justify-start px-4 pt-4 border-b border-black items-start cursor-pointer hover:bg-gray-50 transition ${
        isSelected ? 'bg-gray-100' : ''
      }`}
      onClick={handleOpen}
      tabIndex={0}
      role="button"
    >
      <h2 className={`font-light font-manrope capitalize ${isSelected ? 'text-[#AA9C64]' : ''}`}>{title}</h2>
      <div className="flex justify-between w-full items-start">
        <p className="font-manrope font-semibold text-sm">{date}{stats && ` · ${stats}`}</p>
          <div
          className="flex justify-center items-center gap-4 mb-5"
          onClick={e => e.stopPropagation()}
          >
            <ImageIcon name="delete.svg" onClick={onDelete} alt="Delete" width={20} height={20} />
          {isMobile && (
            <ImageIcon name="expand.svg" onClick={handleOpen} alt="Open" width={20} height={20} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;