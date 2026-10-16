import React from "react";
import WidgetWrapper from "../components/WidgetWrapper";
import { useAzughContext } from "@/context";
import { Button } from "@/components/ui/button";
import { OCCASION_OPTIONS } from "@/data/AzughChatData";

type WidgetProps = {
    className?: string;
};

const OcassionWidget: React.FC<WidgetProps> = ({
    className,
}) => {
    const {
        setSelectedOccasion,
        setShowBudgetWidget,
        setMessages,
        setWidgetAfterIndex,
    } = useAzughContext();

    const options = OCCASION_OPTIONS;

    const handleOptionClick = (val: string) => {
        setSelectedOccasion(val);
        setShowBudgetWidget(true);
        const selectedLabel =
            options.find(opt => opt.value === val)?.label || val;
        setMessages((prev) => [
            ...prev,
            { sender: "user", text: selectedLabel },
            {
                sender: "assistant",
                text: "Let’s talk budget 💸\nNo stress — I’ll style you within your range. Just slide to set what you’re comfortable spending, and I’ll find the best picks that won’t break the bank.",
            },
        ]);
        setWidgetAfterIndex(null);
    };

    return (
        <WidgetWrapper image="/assets/widget-1.png" className={className}>
            <div className="text-center font-semibold text-gray-900 mb-1.5 mt-2.5">What's the occasion?</div>
            <div className="flex flex-wrap gap-2 mb-3 justify-center">
                {options.map((opt) => (
                    <Button
                        variant="outline"
                        key={opt.value}
                        className="flex items-center justify-center py-2 px-2 rounded-full border border-slate-300 hover:bg-gray-200 text-gray-900 font-medium transition min-w-[120px] max-w-full whitespace-nowrap"
                        onClick={() => handleOptionClick(opt.value)}
                        type="button"
                    >
                        {opt.icon && (
                            <img src={opt.icon} alt="" className="w-7 h-7 mr-3 rounded-full object-cover bg-white" />
                        )}
                        <span className="flex-1 text-left">{opt.label}</span>
                    </Button>
                ))}
            </div>
        </WidgetWrapper>
    );
};

export default OcassionWidget;
