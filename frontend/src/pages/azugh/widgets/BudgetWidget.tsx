import React from "react";
import WidgetWrapper from "../components/WidgetWrapper";
import { Button } from "@/components/ui/button";
import { useAzughContext } from "@/context";
import { Input } from "@/components/ui/input";

const MIN_ITEM_PRICE = 20;
const MAX_ITEM_PRICE = 1000;

const BudgetWidget: React.FC<{ className?: string }> = ({
    className,
}) => {
    const {
        budgetValue,
        setBudgetValue,
        setMessages,
        setLoading,
        setShowPiecesWidget,
        setShowBudgetWidget,
        piecesValue,
    } = useAzughContext();

    // Calculate min/max budget based on piecesValue
    const minBudget = Math.max(MIN_ITEM_PRICE * (piecesValue || 1), 20);
    const maxBudget = Math.max(MAX_ITEM_PRICE * (piecesValue || 1), minBudget);

    const value = Math.max(budgetValue, minBudget);

    const handleConfirm = async () => {
        setMessages((prev) => [
            ...prev,
            { sender: "user", text: `$${value}` },
        ]);
        setLoading(true);
        await new Promise((res) => setTimeout(res, 500));
        setMessages((prev) => [
            ...prev,
            {
                sender: "assistant",
                text: "Looking for a full outfit or just a couple of key pieces? Let me know how many items you’re after, and I’ll build the perfect combo for you.",
            },
        ]);
        setShowPiecesWidget(true);
        setShowBudgetWidget(false);
        setLoading(false);
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBudgetValue(parseInt(e.target.value));
    };

    return (
        <WidgetWrapper image="/assets/budget-1.png" className={className}>
            <div className="text-center font-semibold text-gray-900 mb-2 mt-2">
                What’s your budget?
            </div>
            <div className="flex flex-col items-center gap-4 w-full px-5">
                <Button
                    variant="outline"
                    type="button"
                    className="w-full mx-2 rounded-xl border-slate-300 border-[1.5px] text-lg text-gray-800 bg-white"
                    tabIndex={-1}
                >
                    ${value}
                </Button>
                <Input
                    type="range"
                    min={minBudget}
                    max={maxBudget}
                    step={10}
                    value={value}
                    onChange={handleSliderChange}
                    className="w-full p-0 mx-2 mb-4 mt-2 h-2 rounded-lg bg-[#AA9C64] accent-[#D9D9D9] appearance-none"
                />
                <div className="flex justify-between w-full text-xs text-gray-500 px-1">
                    <span>${minBudget}</span>
                    <span>${maxBudget}</span>
                </div>
                <Button
                    type="button"
                    className="w-full mb-2 hover:bg-[#AA9C64] bg-[#DED8D4] text-gray-800 rounded-xl"
                    onClick={handleConfirm}
                >
                    Confirm
                </Button>
            </div>
        </WidgetWrapper>
    );
};

export default BudgetWidget;
