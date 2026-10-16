import { useState, useRef, useEffect } from "react";
import FinalItemsWidget from "./widgets/FinalItemsWidget";
import StartOptionsWidget from "./widgets/StartOptionsWidget";
import ChatInput from "./components/input";
import { AzughProvider, useAzughContext } from "@/context";
import { AssistantAvatar, LoaderDots } from "./components/ChatCommon";
import { ITEMS_OPTIONS } from "@/data/AzughChatData";
import { useRoutesContext } from "@/context/RoutesContext";
import AgentService from "@/features/agent/service/agentServices";
import ChatMessage from "./components/ChatMessage";
import { set } from "date-fns";

const HEADER_HEIGHT_VH = 12; // percent of viewport height
const ChatBotPageInner = () => {
    const {
        messages, setMessages, modalOpen,
        budgetValue,
        piecesValue,
        selectedItems,
        finalItems, setFinalItems,
        removedItems, showHelpButton,
        setShowHelpButton,
        setHeaderScrolled, setInputBlurred,
        itemsCompleted, setItemsCompleted,
        showFinalItemsWidget, setShowFinalItemsWidget,
         loading, setLoading, setModalOpen, setModalItemIdx,
          showHelpButtons, setShowHelpButtons, helpButtons, setHelpButtons
    } = useAzughContext();

    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const [isOnboarding, setIsOnboarding] = useState(false);
    const [helpText, setHelpText] = useState("I don't know where to start...");
    const [showStartOptions, setShowStartOptions] = useState(false);
    const { goToNext } = useRoutesContext();

    useEffect(() => {
        // Check if the current path is the onboarding path
        if (window.location.pathname === "/home/onboarding") {
            setIsOnboarding(true);
            renderFirstMessage(true);
            console.log("Onboarding mode enabled");
        } else {
            setIsOnboarding(false);
            //renderFirstMessage(false);
            setMessages([]);
            setShowStartOptions(true);
        }
    }, []);

    useEffect(() => {
        console.log("Messages updated:", messages);
        if (messages.length === 0) {
            setShowStartOptions(true);
            // check if onboarding
            console.log("Current path:", window.location.pathname);
            if (window.location.pathname === "/home/onboarding") {
                setIsOnboarding(true);
            } else {
                setIsOnboarding(false);
            }
        }

    }, [messages]);

    // render first message as soon as the component mounts
    const renderFirstMessage = async (isOnboarding) => {
        setLoading(true);
        // Small delay to show loading briefly before showing options
        await delay(300);
        
        if (messages.length === 0 && isOnboarding === false) {
            // Show start options widget instead of sending initial message
            setShowStartOptions(true);
            setLoading(false);

        } else if (messages.length === 0) {
            await delay(800);
            setLoading(false);
            setMessages([
                {
                    sender: "assistant",
                    text: "Hey Love, I’m Azugh,  your AI stylist, personal shopper and digital closet, basically your fashion bestie 💖. Let’s skip the boring forms – just talk to me."
                }
            ]);
            setShowHelpButtons(true);
            setHelpButtons([{
                text: "Talk about myself freely",
                onClick: () => {
                    setShowHelpButtons(false);
                    handleSendOnboarding("I need help with outfits", false);
                }
            },
            {
                text: "Choose my aesthetics",
                onClick: () => {
                    setShowHelpButtons(false);
                    handleSendOnboarding("I want to choose my aesthetics", false);
                }
            },
            {
                text: "I don’t know where to start...",
                onClick: () => {
                    setShowHelpButtons(false);
                    handleSendOnboarding("I don’t know where to start...", false);
                }
            }
        ]);

        }
    };

    useEffect(() => {
        const chatDiv = chatContainerRef.current;
        if (!chatDiv) return;

        const handleScroll = () => {
            setHeaderScrolled(chatDiv.scrollTop > 8);
        };
        chatDiv.addEventListener("scroll", handleScroll, { passive: true });

        setTimeout(() => {
            setHeaderScrolled(chatDiv.scrollTop > 8);
        }, 0);

        return () => {
            chatDiv.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        setInputBlurred(messages.length > 1);
    }, [messages.length]);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    // Function to detect if user is asking for product search
    function detectProductSearchIntent(text: string) {
        const t = text.trim().toLowerCase();
        return (
            t.includes("show me") ||
            t.includes("find") ||
            t.includes("search") ||
            t.includes("look for") ||
            t.includes("need") ||
            t.includes("want") ||
            t.includes("shop") ||
            t.includes("buy") ||
            t.includes("outfit") ||
            t.includes("clothes") ||
            t.includes("clothing") ||
            t.includes("items") ||
            t.includes("pieces") ||
            t.includes("top") ||
            t.includes("dress") ||
            t.includes("pants") ||
            t.includes("jeans") ||
            t.includes("shirt") ||
            t.includes("skirt") ||
            t.includes("jacket") ||
            t.includes("coat") ||
            t.includes("shoes")
        );
    }

    const handleStartOptionClick = async (optionTitle: string) => {
        // Hide the start options widget
        setShowStartOptions(false);
        
        // // Send the initial greeting message first
        // setLoading(true);
        // const response = await AgentService.askAgent(
        //     "Introduce yourself as Azugh, a personal fashion assistant. Greet the user in a friendly and professional way, ask how they are doing, and explain that you can help them find outfits based on their plans, style preferences, and desires. Invite them to share what occasion or fashion need they have in mind today."
        // );
        // setLoading(false);
        // setMessages([
        //     {
        //         sender: "assistant",
        //         text: response.response
        //     }
        // ]);
        
        // // Then handle the selected option as user input
        // await delay(500);
        handleSend(`I want to ${optionTitle.toLowerCase()}`);
    };

    const handleSendOnboarding = async (text: string, useIndex: boolean = true) => {
        if (!text.trim()) return;
        setMessages((prev) => [...prev, { sender: "user", text }]);
        setInput("");
        setLoading(true);
        await delay(600);
        setLoading(false);

        const messageIndex = messages.length;
        console.log("Message index:", messageIndex);

        // Show response based on response index
        if (useIndex) {
        switch (messageIndex) {
            case 1:
                setMessages((prev) => [...prev, { sender: "assistant", text: "Love this! Thanks for sharing, it really helps me get a feel for you. Mind telling me a bit about your body? Things like your height, shape, and what sizes you usually wear. Totally no judgment here, just want to make sure what I suggest actually fits you." }]);
                break;
            case 3:
                setMessages((prev) => [...prev, { sender: "assistant", text: "Want me to get even more precise? You can upload a full body and your favorite selfie so I can understand your skin tone, hair, and overall vibe, or just describe it if that feels better for you" }]);
                break;
            case 7:
                setMessages((prev) => [...prev, { sender: "assistant", text: "Done and done. You’ve just created your Azugh style blueprint—full of vibe, voice, and personal story. Let’s build your closet around you now." }]);
                setShowHelpButton(true);
                setHelpText("I'm Ready");
                break;
            case 9:
                // clear messages and finish onboarding
                goToNext();
                setIsOnboarding(false);
                setMessages([{
                    text: "Done and done. You’ve just created your Azugh style blueprint—full of vibe, voice, and personal story. Let’s build your closet around you now.",
                    sender: "assistant"
                }]);
                break;
            default:
                setMessages((prev) => [...prev, { sender: "assistant", text: "That’s interesting! Tell me more or upload a photo." }]);
                break;
        }
    } else {
        // use message content to determine response
        if (text.toLowerCase().includes("aesthetics")) {
            setMessages((prev) => [...prev, { sender: "assistant", text: "Great choice! Let’s get you set up with aesthetics that truly resonate with your style. I’ll guide you through a quick selection process to capture your unique vibe." }]);
        }
    }

    }

    const handleSend = async (text: string) => {
        if (!text.trim()) return;
        
        // Hide start options widget when user sends a message
        setShowStartOptions(false);
        
        setMessages((prev) => [...prev, { sender: "user", text }]);
        setInput("");
        setLoading(true);

        // Count assistant messages to determine if this is after the second agent message
        const assistantMessageCount = messages.filter(msg => msg.sender === "assistant").length;

        // Check if user is asking for product search after the second agent message
        const isProductSearch = detectProductSearchIntent(text);
        const shouldShowItemsWidget = assistantMessageCount >= 2 && isProductSearch;

        const response = await AgentService.askAgent(text);

        let assistantResponse = response?.response || "Sorry, I didn't get that. Could you please rephrase?";

        // If we should show items widget, modify the response to trigger it
        if (shouldShowItemsWidget) {
            assistantResponse = "Tops, dresses, pants, or maybe outerwear? Pick the type of clothing you're looking for, and I'll show you the best options in style.";
        }

        setLoading(false);
        setMessages((prev) => [...prev, { sender: "assistant", text: assistantResponse }]);

        // Reactivate product demo - if it is the third agent message, return products recommendations
        if (messages.length === 5) {
            // Mock product recommendations for demo purposes
            const demoRecommendations = [
                { image: "/assets/placeholder.png", dressName: "Demo Dress", brandName: "Demo Brand", price: 89 },
                { image: "/assets/placeholder.png", dressName: "Demo Top", brandName: "Demo Brand", price: 45 },
                { image: "/assets/placeholder.png", dressName: "Demo Pants", brandName: "Demo Brand", price: 76 }
            ];
            setFinalItems(demoRecommendations);
            setShowFinalItemsWidget(true);
        }

        // if (
        //     text.trim().toLowerCase() === "i don’t know where to start..." ||
        //     text.trim().toLowerCase() === "i don't know where to start..." ||
        //     text.trim().toLowerCase() === "help"
        // ) {
        //     setShowHelpButton(false);
        // }

        // await delay(600);

        // // Intent-based assistant responses
        // const intent = detectIntent(text);
        // let assistantMsg = null;

        // // --- Handle context state for straight prompt answers ---
        // switch (intent) {
        //     case "travel_dubai":
        //         setSelectedOccasion && setSelectedOccasion("dubai");
        //         break;
        //     case "ask_dresses":
        //         setSelectedItems && setSelectedItems([
        //             { label: "Dress", value: "dress", icon: "/assets/placeholder.png" }
        //         ]);
        //         // New: Set itemsCompleted to false so useEffect doesn't auto-trigger
        //         setItemsCompleted(false);
        //         assistantMsg = {
        //             sender: "assistant",
        //             text: "do you want me to gather pieces from your wardrobe & suggest new items for you?",
        //         };
        //         break;
        //     case "provide_budget": {
        //         const num = extractNumber(text);
        //         if (num) setBudgetValue && setBudgetValue(num);
        //         break;
        //     }
        //     case "provide_days": {
        //         const num = extractNumber(text);
        //         if (num) setPiecesValue && setPiecesValue(num);
        //         break;
        //     }
        //     case "preferred_color": {
        //         const color = extractColor(text);
        //         // If you want to store color in context, do it here
        //         // setColor && setColor(color);
        //         break;
        //     }
        //     default:
        //         break;
        // }

        // // --- Assistant responses and FinalItemsWidget trigger ---
        // switch (intent) {
        //     case "travel_dubai":
        //         assistantMsg = {
        //             sender: "assistant",
        //             text: "sure! Are you looking for anything specific?",
        //         };
        //         break;
        //     case "ask_dresses":
        //         assistantMsg = {
        //             sender: "assistant",
        //             text: "do you want me to gather pieces from your wardrobe & suggest new items for you?",
        //         };
        //         break;
        //     case "suggest_new_items":
        //         assistantMsg = {
        //             sender: "assistant",
        //             text: "Do you have a total budget in mind?",
        //         };
        //         break;
        //     case "provide_budget":
        //         assistantMsg = {
        //             sender: "assistant",
        //             text: "how many days are you staying?",
        //         };
        //         break;
        //     case "how_many_days":
        //         assistantMsg = {
        //             sender: "assistant",
        //             text: "how many days are you staying?",
        //         };
        //         break;
        //     case "provide_days":
        //         assistantMsg = {
        //             sender: "assistant",
        //             text: "do you need day outfits & nights outfits?",
        //         };
        //         break;
        //     case "day_and_night_outfits":
        //         assistantMsg = {
        //             sender: "assistant",
        //             text: "any preferred color?",
        //         };
        //         break;
        //     case "only_day_outfits":
        //         assistantMsg = {
        //             sender: "assistant",
        //             text: "any preferred color?",
        //         };
        //         break;
        //     case "preferred_color":
        //         assistantMsg = {
        //             sender: "assistant",
        //             text: "Here are some recommendations for you!",
        //         };
        //         // Generate recommendations and show FinalItemsWidget
        //         (async () => {
        //             await delay(700);
        //             // Use selectedItems, budgetValue, piecesValue to generate recommendations
        //             let filteredItems = selectedItems && selectedItems.length > 0
        //                 ? selectedItems
        //                 : [{ label: "Dress", value: "dress", icon: "/assets/dummy-img.png" }];
        //             let total = budgetValue || 210;
        //             let count = piecesValue || 3;
        //             count = Math.max(count, 3);
        //             const MIN_ITEM_PRICE = 20;
        //             const MAX_ITEM_PRICE = 1000;
        //             let base = count > 0 ? Math.floor(total / count) : 0;
        //             base = Math.max(base, MIN_ITEM_PRICE);
        //             base = Math.min(base, MAX_ITEM_PRICE);
        //             let prices = Array(count).fill(base);
        //             let sum = base * count;
        //             let diff = total - sum;
        //             for (let i = 0; i < count && diff > 0; i++) {
        //                 let add = Math.min(diff, MAX_ITEM_PRICE - prices[i]);
        //                 prices[i] += add;
        //                 diff -= add;
        //             }
        //             // Use ITEMS_OPTIONS to get correct image path for each selected item
        //             setFinalItems(
        //                 Array(count).fill(0).map((_, idx) => {
        //                     const item = filteredItems[idx % filteredItems.length];
        //                     // Find the matching option from ITEMS_OPTIONS by value or label
        //                     // const option = ITEMS_OPTIONS.find(opt =>
        //                     //     opt.value === item.value ||
        //                     //     opt.label.toLowerCase() === item.label.toLowerCase()
        //                     // );
        //                     const option = ITEMS_OPTIONS[idx]
        //                     // Use the first image from option.images if available
        //                     return {
        //                         image: option?.images || option?.icon || item.icon || "/assets/placeholder.png",
        //                         dressName: option?.label || item.label || "Item",
        //                         brandName: option?.brand || "Brand " + (idx + 1),
        //                         price: option?.price || prices[idx] || 50,
        //                     };
        //                 })
        //             );
        //             setShowFinalItemsWidget(true);
        //             setLoading(false);
        //         })();
        //         break;
        //     default:
        //         // ...existing widget/intent logic...
        //         if (
        //             text.trim().toLowerCase() === "i don’t know where to start..." ||
        //             text.trim().toLowerCase() === "help"
        //         ) {
        //             assistantMsg = {
        //                 sender: "assistant",
        //                 text: "Tell me where you’re headed, and I’ll pick the perfect look for it. Whether it’s a casual coffee run or a special night out — I’ve got your style covered. ✨",
        //             };
        //             setMessages((prev) => [...prev, assistantMsg]);
        //             setWidgetAfterIndex(messages.length + 1);
        //             setLoading(false);
        //             return;
        //         } else {
        //             if (!showBudgetWidget && !showPiecesWidget && !showItemsWidget) {
        //                 assistantMsg = {
        //                     sender: "assistant",
        //                     text: "That's interesting! Tell me more or upload a photo.",
        //                 };
        //             } else {
        //                 assistantMsg = {
        //                     sender: "assistant",
        //                     text: "Thanks for sharing! Let me know if you want to continue or need help with your outfit.",
        //                 };
        //             }
        //             setWidgetAfterIndex(null);
        //         }
        // }

        // if (assistantMsg) {
        //     setMessages((prev) => [...prev, assistantMsg]);
        // }
        // // For "preferred_color", loading is handled in the async block above
        // if (intent !== "preferred_color") setLoading(false);
    };

    // Effect: When selectedItems reaches piecesValue, close ItemsWidget and proceed
    useEffect(() => {
        if (
            !itemsCompleted &&
            selectedItems.length === piecesValue &&
            selectedItems.length > 0
        ) {
            const wasAutoSelected = selectedItems.length === 1 && selectedItems[0]?.label === "Dress";
            if (wasAutoSelected) return; // <-- Prevent auto trigger here
            setItemsCompleted(true);
            setMessages((prev) => [
                ...prev,
                { sender: "user", text: selectedItems.map(i => i.label).join(", ") },
            ]);
            setLoading(true);
            (async () => {
                await delay(700);
                setMessages((prev) => {
                    const finalMsg = "I’ve analyzed all your answers — now it’s my turn. Sit back and relax while I find pieces that match your vibe, budget, and needs perfectly. Let’s build your look! ✨";
                    if (prev.some(msg => msg.text === finalMsg && msg.sender === "assistant")) return prev;
                    return [...prev, { sender: "assistant", text: finalMsg }];
                });

                // Distribute budgetValue across all items, ensuring total <= budgetValue and per-item <= MAX_ITEM_PRICE
                let filteredItems = selectedItems.filter(
                    item => !removedItems.has(item.label)
                );
                let total = budgetValue;
                let count = filteredItems.length;
                const MIN_ITEM_PRICE = 20;
                const MAX_ITEM_PRICE = 1000;
                let base = count > 0 ? Math.floor(total / count) : 0;
                base = Math.max(base, MIN_ITEM_PRICE);
                base = Math.min(base, MAX_ITEM_PRICE);
                let prices = Array(count).fill(base);
                let sum = base * count;
                let diff = total - sum;

                // Distribute the remaining budget (diff) to items, not exceeding MAX_ITEM_PRICE
                for (let i = 0; i < count && diff > 0; i++) {
                    let add = Math.min(diff, MAX_ITEM_PRICE - prices[i]);
                    prices[i] += add;
                    diff -= add;
                }

                // Use ITEMS_OPTIONS to get images for each selected item
                setFinalItems(
                    filteredItems.map((item, idx) => {
                        const option = ITEMS_OPTIONS.find(opt => opt.label === item.label);
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
    }, [selectedItems, piecesValue, itemsCompleted, removedItems]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        
        // Hide start options when messages are present
        if (messages.length > 0) {
            setShowStartOptions(false);
        }
    }, [messages, loading]);

    // Modal handlers for FinalItems
    const handleFinalItemClick = (itemIdx: number) => {
        // The current item is already set in context by handleItemClick
        setModalItemIdx(itemIdx);
        setModalOpen(true);
    };

    return (
        <div className="w-full h-auto flex flex-col items-center justify-center">
            <div className="fixed inset-0 w-full h-full z-0 bg-transparent pointer-events-none" aria-hidden="true" />
            <div className="w-full md:w-1/2 h-screen flex flex-col items-center justify-between">
                <div
                    ref={chatContainerRef}
                    className="w-full flex-1 flex flex-col space-y-4 fixed left-0 right-0 md:w-1/2 md:left-1/4 overflow-y-auto hide-scrollbar"
                    style={{
                        top: `calc(${HEADER_HEIGHT_VH}vh)`,
                        bottom: "90px"
                    }}
                >
                    {messages.map((msg, index) => {
                        const isLastAssistant =
                            index === messages.length - 1 && msg.sender === "assistant";

                        return (
                            <ChatMessage
                                key={index}
                                msg={msg}
                                isLastAssistant={isLastAssistant}
                            />
                        );
                    })}
                    {/* Only render FinalItemsWidget once, after all chat bubbles, when ready */}
                    {showFinalItemsWidget && finalItems.length > 0 && (
                        <div className="w-full">
                            <FinalItemsWidget
                                className="w-full"
                                onItemClick={handleFinalItemClick}
                            />
                        </div>
                    )}
                    {loading && (
                        <div className="flex items-end justify-start px-4">
                            <AssistantAvatar />
                            <div className="p-4 rounded-xl bg-transparent shadow-none flex items-center">
                                <LoaderDots />
                            </div>
                        </div>
                    )}
                    {/* Start Options Widget - shown when no messages and not onboarding */}
                    {showStartOptions && !isOnboarding && messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center w-full h-full absolute inset-0 px-6">
                            <div className="flex flex-col items-center w-full space-y-8 animate-fade-in">
                                <div className="text-center space-y-3">
                                    <h2 className="text-3xl font-medium text-white font-manrope">
                                        Hi there, how are you today?
                                    </h2>
                                    <p className="text-white font-light text-base leading-relaxed">
                                        Let's get started! How can I assist you with your style today?
                                    </p>
                                </div>
                                <StartOptionsWidget 
                                    onOptionClick={handleStartOptionClick}
                                    className="transform transition-all duration-700 ease-out animate-slide-up md"
                                />
                            </div>
                        </div>
                    )}
                    {/* add empty container to leave space for the last message */}
                    {showHelpButton && (
                        <div className="flex items-end justify-start px-4 w-full" style={{ minHeight: "3.0rem", height: "3.0rem" }} />
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Chat input area */}
                <div className={`${modalOpen ? "hidden" : ""} ${showStartOptions ? "fixed bottom-4 left-0 right-0 px-4 md:left-1/4 md:right-1/4" : ""} transition-all duration-500 ease-in-out`}>
                    <ChatInput
                        input={input}
                        setInput={setInput}
                        loading={loading}
                        onSend={isOnboarding ? handleSendOnboarding : handleSend}
                        showHelpButton={showHelpButton}
                        helpText={helpText}
                        setShowHelpButton={setShowHelpButton}
                        helpButtons={helpButtons}
                        showHelpButtons={showHelpButtons}
                        showFinalItemsWidget={showFinalItemsWidget}
                        isOnboarding={isOnboarding}
                    />
                </div>
            </div>
        </div>
    );
};

export interface ChatBotPageProps {
    className?: string;
}

// Wrap the page with AzughProvider
const ChatBotPage = ({ className }: ChatBotPageProps) => (
    // <AzughProvider>
        <ChatBotPageInner />
        // </AzughProvider>
);

export default ChatBotPage;
