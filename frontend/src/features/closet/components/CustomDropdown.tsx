import ImageIcon from "@/components/icons/ImageIcon";
import React, { useRef, useLayoutEffect, useState } from "react";

const CustomDropdownCloset: React.FC<{
    label: string;
    value: string | null;
    options: string[];
    onSelect: (value: string) => void;
    isOpen: boolean;
    onToggle: () => void;
    dropdownRef: React.RefObject<HTMLDivElement>;
    width?: string;
    renderOptionExtra?: (option: string) => React.ReactNode;
}> = ({
    label,
    value,
    options,
    onSelect,
    isOpen,
    onToggle,
    dropdownRef,
    width = "150px",
    renderOptionExtra
}) => {
        const menuRef = useRef<HTMLDivElement>(null);
        const [menuPosition, setMenuPosition] = useState<{ top: number; left: number; bottom?: number }>({ top: 0, left: 0 });

        useLayoutEffect(() => {
            if (isOpen && dropdownRef.current && menuRef.current) {
                const triggerRect = dropdownRef.current.getBoundingClientRect();
                const menuHeight = menuRef.current.offsetHeight;
                const viewportHeight = window.innerHeight;
                const spaceBelow = viewportHeight - triggerRect.bottom;
                const spaceAbove = triggerRect.top;

                let position: { top: number; left: number; bottom?: number };

                // If there's enough space below, place it below
                if (spaceBelow >= menuHeight + 8) {
                    position = {
                        top: triggerRect.bottom + window.scrollY + 8,
                        left: triggerRect.right + window.scrollX - parseInt(width)
                    };
                }
                // If there's enough space above, place it above
                else if (spaceAbove >= menuHeight + 8) {
                    position = {
                        top: triggerRect.top + window.scrollY - menuHeight - 8,
                        left: triggerRect.right + window.scrollX - parseInt(width)
                    };
                }
                // Otherwise, position it to fit within viewport
                else {
                    position = {
                        top: Math.max(8, Math.min(triggerRect.bottom + window.scrollY + 8, viewportHeight - menuHeight - 8)),
                        left: triggerRect.right + window.scrollX - parseInt(width)
                    };
                }

                setMenuPosition(position);
            }
        }, [isOpen, width, dropdownRef]);

        return (
            <div
                className="flex items-center h-10 justify-between bg-white rounded-xl px-3 sm:px-4 md:px-5 py-4 sm:py-4 relative border border-black"
                ref={dropdownRef}
                onClick={onToggle} // <-- Make whole input clickable
                tabIndex={0}       // <-- Allow keyboard focus
                style={{ cursor: "pointer" }} // Optional: show pointer cursor
            >
                <span
                    className={`text-sm sm:text-base md:text-lg ${value ? "text-black" : "text-gray-400"
                        }`}
                >
                    {label}
                </span>
                <div className="relative ml-4 min-w-[44px] flex items-center justify-end">
                    {!isOpen && (
                        <ImageIcon name="chevron.svg" className="w-4 h-4 text-gray-400" />
                    )}
                    {/* Menu */}
                    {isOpen && (
                        <div
                            ref={menuRef}
                            className="fixed z-50 bg-[#F0EDEB] rounded-xl shadow-lg border border-black max-h-40 overflow-y-auto scrollbar-hide"
                            style={{
                                minWidth: 100,
                                width,
                                top: menuPosition.top,
                                left: menuPosition.left,
                            }}
                        >
                            {options.map(opt => (
                                <button
                                    key={opt}
                                    type="button"
                                    className={`w-full font-manrope text-left px-3 py-1.5 flex items-center justify-between text-black hover:bg-gray-100 transition text-sm ${value === opt ? "bg-[#DED8D4CC]" : ""}`}
                                    onClick={e => {
                                        e.stopPropagation();
                                        onSelect(opt);
                                        onToggle();
                                    }}
                                >
                                    <span className="flex items-center">
                                        {renderOptionExtra && renderOptionExtra(opt)}
                                        {opt}
                                    </span>
                                    {value === opt && <span className="text-sm">✓</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

export default CustomDropdownCloset;
