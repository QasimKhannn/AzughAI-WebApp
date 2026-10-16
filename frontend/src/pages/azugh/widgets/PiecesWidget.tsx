import React from "react";
import WidgetWrapper from "../components/WidgetWrapper";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useAzughContext } from "@/context";

const PiecesWidget: React.FC<{ className?: string }> = ({
    className,
}) => {
    const {
        piecesValue,
        setPiecesValue,
        setMessages,
        setLoading,
        setShowItemsWidget,
        setShowPiecesWidget,
    } = useAzughContext();

    const value = piecesValue;

    const handleConfirm = async () => {
        setMessages((prev) => [
            ...prev,
            { sender: "user", text: `${piecesValue} piece${piecesValue > 1 ? "s" : ""}` },
        ]);
        setLoading(true);
        await new Promise(res => setTimeout(res, 500));
        setMessages((prev) => {
            const alreadyAdded = prev.some(
                (msg) =>
                    msg.sender === "assistant" &&
                    msg.text === "Tops, dresses, pants, or maybe outerwear? Pick the type of clothing you’re looking for, and I’ll show you the best options in style."
            );
            if (alreadyAdded) return prev;

            return [
                ...prev,
                {
                    sender: "assistant",
                    text: "Tops, dresses, pants, or maybe outerwear? Pick the type of clothing you’re looking for, and I’ll show you the best options in style.",
                },
            ];
        });
        setShowItemsWidget(true);
        setShowPiecesWidget(false);
        setLoading(false);
    };

    const handleDecrement = () => {
        if (value > 1) setPiecesValue(value - 1);
    };
    const handleIncrement = () => {
        setPiecesValue(value + 1);
    };

    return (
        <WidgetWrapper image="/assets/pieces-1.png" className={className}>
            <div className="text-center font-semibold text-gray-900 mb-2 mt-2">
                How many pieces are you looking for?
            </div>
            <div className="flex mb-4 flex-row items-center justify-center gap-4 w-full px-5">
                <Button
                    type="button"
                    className="rounded-full hover:bg-[#AA9C64] hover:text-white bg-[#F0EDEB] text-[#AA9C64] w-10 h-10 flex items-center justify-center text-xl"
                    onClick={handleDecrement}
                >
                    <Minus className="w-[22px] h-[22px] block" />
                </Button>
                <span className="text-lg text-gray-900 w-8 text-center select-none">{value}</span>
                <Button
                    type="button"
                    className="rounded-full hover:bg-[#AA9C64] hover:text-white bg-[#F0EDEB] text-[#AA9C64] w-10 h-10 flex items-center justify-center text-xl"
                    onClick={handleIncrement}
                >
                    <Plus className="w-[22px] h-[22px] block" />
                </Button>
            </div>
            <div className="w-full px-5">
                <Button
                    type="button"
                    className="w-full mb-2 bg-[#DED8D4] hover:bg-[#AA9C64] text-gray-800 rounded-xl"
                    onClick={handleConfirm}
                >
                    Confirm
                </Button>
            </div>
        </WidgetWrapper>
    );
};

export default PiecesWidget;
