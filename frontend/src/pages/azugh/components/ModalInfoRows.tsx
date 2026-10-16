import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface ModalInfoRowsProps {
    sizes?: string[];
    description?: string;
    fabric?: string;
}

const ModalInfoRows: React.FC<ModalInfoRowsProps> = ({ 
    sizes, 
    description, 
    fabric 
}) => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({
        sizes: false,
        description: false,
        fabric: false,
    });

    const toggleSection = (section: string) => {
        setExpanded(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const sections = [
        {
            key: "sizes",
            label: "Sizes",
            content: sizes && sizes.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                    {sizes.map((size, idx) => (
                        <span
                            key={idx}
                            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-manrope text-gray-800 bg-white"
                        >
                            {size}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500 mt-2 font-manrope">No sizes available</p>
            ),
            hasData: sizes && sizes.length > 0,
        },
        {
            key: "description",
            label: "Description",
            content: description ? (
                <p className="text-sm text-gray-700 mt-2 font-manrope leading-relaxed whitespace-pre-line">
                    {description}
                </p>
            ) : (
                <p className="text-sm text-gray-500 mt-2 font-manrope">No description available</p>
            ),
            hasData: !!description,
        },
        {
            key: "fabric",
            label: "Fabric",
            content: fabric ? (
                <p className="text-sm text-gray-700 mt-2 font-manrope">
                    {fabric}
                </p>
            ) : (
                <p className="text-sm text-gray-500 mt-2 font-manrope">No fabric information available</p>
            ),
            hasData: !!fabric,
        },
    ];

    return (
        <div className="w-full">
            {sections.map((section) => (
                <div key={section.key} className="border-t border-gray-200">
                    <button
                        onClick={() => toggleSection(section.key)}
                        className="w-full flex justify-between items-center py-3 hover:bg-gray-50 transition-colors"
                    >
                        <span className="font-manrope text-gray-800 text-left">
                            {section.label}
                        </span>
                        <div className="flex items-center gap-2">
                            {expanded[section.key] ? (
                                <Minus size={18} className="text-gray-600" />
                            ) : (
                                <Plus size={18} className="text-gray-600" />
                            )}
                        </div>
                    </button>
                    {expanded[section.key] && (
                        <div className="pb-3 px-0 transition-all duration-200 ease-in-out">
                            {section.content}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ModalInfoRows;
