import React, { createContext, useContext, useState, ReactNode } from "react";
import { HelpButtonsProps } from "@/pages/azugh/components/input";

type AzughContextType = {
    messages: any[];
    setMessages: React.Dispatch<React.SetStateAction<any[]>>;
    budgetValue: number;
    setBudgetValue: React.Dispatch<React.SetStateAction<number>>;
    piecesValue: number;
    setPiecesValue: React.Dispatch<React.SetStateAction<number>>;
    selectedItems: { label: string; value: string; icon?: string }[];
    setSelectedItems: React.Dispatch<React.SetStateAction<{ label: string; value: string; icon?: string }[]>>;
    finalItems: any[];
    setFinalItems: React.Dispatch<React.SetStateAction<any[]>>;
    removedItems: Set<string>;
    setRemovedItems: React.Dispatch<React.SetStateAction<Set<string>>>;
    showHelpButton: boolean;
    setShowHelpButton: React.Dispatch<React.SetStateAction<boolean>>;
    showHelpButtons: boolean;
    setShowHelpButtons: React.Dispatch<React.SetStateAction<boolean>>;
    helpButtons: HelpButtonsProps[];
    setHelpButtons: React.Dispatch<React.SetStateAction<HelpButtonsProps[]>>;
    showBudgetWidget: boolean;
    setShowBudgetWidget: React.Dispatch<React.SetStateAction<boolean>>;
    showPiecesWidget: boolean;
    setShowPiecesWidget: React.Dispatch<React.SetStateAction<boolean>>;
    showItemsWidget: boolean;
    setShowItemsWidget: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOccasion: string | null;
    setSelectedOccasion: React.Dispatch<React.SetStateAction<string | null>>;
    headerScrolled: boolean;
    setHeaderScrolled: React.Dispatch<React.SetStateAction<boolean>>;
    inputBlurred: boolean;
    setInputBlurred: React.Dispatch<React.SetStateAction<boolean>>;
    itemsCompleted: boolean;
    setItemsCompleted: React.Dispatch<React.SetStateAction<boolean>>;
    showFinalItemsWidget: boolean;
    setShowFinalItemsWidget: React.Dispatch<React.SetStateAction<boolean>>;
    widgetAfterIndex: number | null;
    setWidgetAfterIndex: React.Dispatch<React.SetStateAction<number | null>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    currentItem: any;
    setCurrentItem: React.Dispatch<React.SetStateAction<any>>;
    modalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    modalItemIdx: number | null;
    setModalItemIdx: React.Dispatch<React.SetStateAction<number | null>>;
};

const AzughContext = createContext<AzughContextType | undefined>(undefined);

export const AzughProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<any[]>(
        [
            // {
            //     sender: "assistant",
            //     text: "Hey Jules 🐚 Ready to plan your next look? Tell me what’s coming up!",
            // },
        ]
    );
    const [budgetValue, setBudgetValue] = useState<number>(100);
    const [piecesValue, setPiecesValue] = useState<number>(1);
    const [selectedItems, setSelectedItems] = useState<{ label: string; value: string; icon?: string }[]>([]);
    const [finalItems, setFinalItems] = useState<any[]>([]);
    const [removedItems, setRemovedItems] = useState<Set<string>>(new Set());
    const [showHelpButton, setShowHelpButton] = useState(false);
    const [showHelpButtons, setShowHelpButtons] = useState(false);
    const [helpButtons, setHelpButtons] = useState<HelpButtonsProps[]>([]);
    const [showBudgetWidget, setShowBudgetWidget] = useState(false);
    const [showPiecesWidget, setShowPiecesWidget] = useState(false);
    const [showItemsWidget, setShowItemsWidget] = useState(false);
    const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
    const [headerScrolled, setHeaderScrolled] = useState(false);
    const [inputBlurred, setInputBlurred] = useState(false);
    const [itemsCompleted, setItemsCompleted] = useState(false);
    const [showFinalItemsWidget, setShowFinalItemsWidget] = useState(false);
    const [widgetAfterIndex, setWidgetAfterIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentItem, setCurrentItem] = useState<any>();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalItemIdx, setModalItemIdx] = useState<number | null>(null);

    return (
        <AzughContext.Provider
            value={{
                messages,
                setMessages,
                budgetValue,
                setBudgetValue,
                piecesValue,
                setPiecesValue,
                selectedItems,
                setSelectedItems,
                finalItems,
                setFinalItems,
                removedItems,
                setRemovedItems,
                showHelpButton,
                setShowHelpButton,
                showHelpButtons,
                setShowHelpButtons,
                helpButtons,
                setHelpButtons,
                showBudgetWidget,
                setShowBudgetWidget,
                showPiecesWidget,
                setShowPiecesWidget,
                showItemsWidget,
                setShowItemsWidget,
                selectedOccasion,
                setSelectedOccasion,
                headerScrolled,
                setHeaderScrolled,
                inputBlurred,
                setInputBlurred,
                itemsCompleted,
                setItemsCompleted,
                showFinalItemsWidget,
                setShowFinalItemsWidget,
                widgetAfterIndex,
                setWidgetAfterIndex,
                loading,
                setLoading,
                currentItem,
                setCurrentItem,
                modalOpen,
                setModalOpen,
                modalItemIdx,
                setModalItemIdx
            }}
        >
            {children}
        </AzughContext.Provider>
    );
};

export const useAzughContext = () => {
    const ctx = useContext(AzughContext);
    if (!ctx) throw new Error("useAzughContext must be used within AzughProvider");
    return ctx;
};