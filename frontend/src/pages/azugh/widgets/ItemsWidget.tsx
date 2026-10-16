import React, { useState } from "react";
import WidgetWrapper from "../components/WidgetWrapper";
import { useAzughContext } from "@/context";
import { ITEMS_OPTIONS } from "@/data/AzughChatData";
import { Button } from "@/components/ui/button";

const ItemsWidget: React.FC<{ className?: string }> = ({
    className,
}) => {
    const {
        piecesValue,
        selectedItems,
        setSelectedItems,
        itemsCompleted,
        setItemsCompleted,
        removedItems,
        setMessages,
        setLoading,
        setFinalItems,
        setShowFinalItemsWidget,
    } = useAzughContext();

    const options = ITEMS_OPTIONS;
    const selectLimit = piecesValue;
    const [selected, setSelected] = useState(selectedItems || []);

    React.useEffect(() => {
        if (
            !itemsCompleted &&
            selected.length === selectLimit &&
            selected.length > 0
        ) {
            setItemsCompleted(true);
            setMessages((prev) => [
                ...prev,
                { sender: "user", text: selected.map(i => i.label).join(", ") },
            ]);
            setLoading(true);
            (async () => {
                await new Promise(res => setTimeout(res, 700));
                setMessages((prev) => {
                    const finalMsg = "I’ve analyzed all your answers — now it’s my turn. Sit back and relax while I find pieces that match your vibe, budget, and needs perfectly. Let’s build your look! ✨";
                    if (prev.some(msg => msg.text === finalMsg && msg.sender === "assistant")) return prev;
                    return [...prev, { sender: "assistant", text: finalMsg }];
                });

                // Distribute budgetValue across all items, ensuring total <= budgetValue
                let filteredItems = selected.filter(
                    item => !removedItems.has(item.label)
                );
                let total = 0;
                try {
                    total = parseInt(localStorage.getItem("budgetValue") || "0") || 0;
                } catch {
                    total = 0;
                }
                let count = filteredItems.length;
                let base = count > 0 ? Math.floor(total / count) : 0;
                let remainder = count > 0 ? total - base * count : 0;
                const prices = Array(count).fill(base).map((v, i) => v + (i < remainder ? 1 : 0));

                setFinalItems(
                    filteredItems.map((item, idx) => {
                        const option = options.find(opt => opt.label === item.label);
                        return {
                            image: option?.images || [item.icon || "/assets/placeholder.png"],
                            dressName: item.label + " Example",
                            brandName: "Brand " + (idx + 1),
                            price: prices[idx],
                        };
                    })
                );
                setShowFinalItemsWidget(true);
                setLoading(false);
            })();
        }
        setSelectedItems(selected);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected, selectLimit, itemsCompleted, removedItems]);

    const handleSelect = (val: string) => {
        const already = selected.find((s) => s.value === val);
        if (already) {
            setSelected((prev) => prev.filter((s) => s.value !== val));
        } else if (selected.length < selectLimit) {
            const opt = options.find((o) => o.value === val);
            if (opt) setSelected((prev) => [...prev, opt]);
        }
    };

    return (
        <WidgetWrapper image="/assets/items-1.png" className={className}>
            <div className="text-center font-semibold text-gray-900 mb-1.5 mt-2.5">What do you need today?</div>
            <div className="flex flex-wrap gap-2 justify-center mb-3">
                {options.map((opt) => {
                    const isSelected = !!selected.find((s) => s.value === opt.value);
                    return (
                        <Button
                            variant="outline"
                            key={opt.value}
                            className={`flex items-center justify-center py-2 px-2 rounded-full border transition font-medium
                                ${isSelected ? "border-[#AA9C64] bg-[#F6F3EA] text-[#AA9C64]" : "border-slate-300 hover:bg-gray-200 text-gray-900"}
                                min-w-[120px] max-w-full whitespace-nowrap
                            `}
                            onClick={() => handleSelect(opt.value)}
                            type="button"
                            disabled={
                                !isSelected && selected.length >= selectLimit
                            }
                        >
                            {opt.icon && (
                                <span className="items-widget-icon mr-3 flex items-center justify-center">
                                    <img
                                        src={opt.icon}
                                        alt=""
                                        className="w-7 h-7 object-contain"
                                    />
                                </span>
                            )}
                            <span className="flex-1 text-left">{opt.label}</span>
                        </Button>
                    );
                })}
            </div>
            <div className="text-xs text-gray-500 text-center">
                {selected.length} of {selectLimit} selected
            </div>
        </WidgetWrapper>
    );
};

export default ItemsWidget;
