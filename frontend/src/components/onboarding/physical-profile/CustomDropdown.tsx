import React, { useRef, useLayoutEffect, useState } from "react";

const CustomDropdown: React.FC<{
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
        <div className="flex items-center h-16 justify-between bg-white/10 rounded-xl px-3 sm:px-4 md:px-5 py-4 sm:py-4 relative border border-white" ref={dropdownRef}>
            <span className="text-sm sm:text-base md:text-lg font-medium text-white">{label}</span>
            <div
                className="relative ml-4 min-w-[44px] flex items-center justify-end cursor-pointer"
                tabIndex={0}
                onClick={onToggle}
            >
                {!isOpen && (
                    <svg width="28" height="28" viewBox="0 0 20 20" fill="none">
                        <path d="M6 8l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
                {/* Menu */}
                {isOpen && (
                    <div
                        ref={menuRef}
                        className="fixed z-50 bg-[#F5F2F0] rounded-xl shadow-lg border border-[#E4DFDC] max-h-40 overflow-y-auto scrollbar-hide"
                        style={{
                            minWidth: 100,
                            width,
                            top: menuPosition.top,
                            left: menuPosition.left,
                        }}
                    >
                        {renderOptionExtra && renderOptionExtra("")}
                        {options.map(opt => (
                            <button
                                key={opt}
                                type="button"
                                className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-[#000] hover:bg-[#EDEAE8] transition text-sm ${value === opt ? "font-bold" : ""}`}
                                onClick={e => {
                                    e.stopPropagation();
                                    onSelect(opt);
                                    onToggle();
                                }}
                            >
                                <span>{opt}</span>
                                {value === opt && <span className="text-sm">✓</span>}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomDropdown;
