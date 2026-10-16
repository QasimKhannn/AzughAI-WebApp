import PageLayout from '@/layout/PageLayout'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useLocation, useNavigate } from "react-router-dom"
import ProductGrid from "@/components/ProductGrid"
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ImageIcon from '@/components/icons/ImageIcon'
import { useState } from 'react';
import MainModal from '@/pages/azugh/components/MainModal';
import { useIsMobile } from "@/hooks/use-mobile";
import { Thread } from "@/features/agent/types";

interface ConversationSummaryProps {
    conversation?: Thread;
    isEmbedded?: boolean;
}

const ConversationSummary: React.FC<ConversationSummaryProps> = ({ 
    conversation, 
    isEmbedded = false 
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useIsMobile();
    
    // Use props data if embedded, otherwise use location state
    const conversationData = conversation || location.state || {};
    const {
        closet = [],
        wishlist = [],
        cart = [],
        disliked = [],
        title = "Conversation Summary",
        subtitle = "We discussed outfit ideas for summer evenings, focusing on lightweight shirts and casual loafers. You saved two linen shirts and one pair of shoes to your Wishlist."
    } = conversationData;

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalItemIdx, setModalItemIdx] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState("tab1");

    // Add wishlist state management
    const [localWishlist, setLocalWishlist] = useState<Set<string>>(new Set());

    const handleHeartClick = (id: string) => {
        setLocalWishlist(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    // Get products for the active tab
    const getActiveProducts = () => {
        switch (activeTab) {
            case "tab1": return closet;
            case "tab2": return wishlist;
            case "tab3": return cart;
            case "tab4": return disliked;
            default: return [];
        }
    };

    // Map active products to modal format
    const modalItems = getActiveProducts().map(item => ({
        image: (item.images && item.images.length > 0) ? item.images : [item.image],
        dressName: item.name,
        brandName: item.brand,
        price: item.price,
    }));

    // Wishlist and cart state for modal
    const [modalWishlist, setModalWishlist] = useState<Set<string>>(new Set());
    const [modalCart, setModalCart] = useState<Set<string>>(new Set());

    const handleWishlist = (idx: number) => {
        setModalWishlist(prev => {
            const newSet = new Set(prev);
            const name = modalItems[idx].dressName;
            if (newSet.has(name)) newSet.delete(name);
            else newSet.add(name);
            return newSet;
        });
    };

    const handleAddToCart = (idx: number) => {
        setModalCart(prev => {
            const newSet = new Set(prev);
            const name = modalItems[idx].dressName;
            if (newSet.has(name)) newSet.delete(name);
            else newSet.add(name);
            return newSet;
        });
    };

    // Helper for empty state
    const renderEmptyState = (label: string, description: string) => (
        <div className={`flex flex-col bg-white justify-between items-center text-center px-8 pb-12 ${isMobile ? 'h-[65vh]' : 'h-[50vh]'} w-full`}>
            <div className='flex flex-col justify-center items-center px-5'>
                <ImageIcon name="empty-cart.svg" alt={label} width={64} height={64} className="mb-3" />
                <h2 className={`${isMobile ? 'text-xl' : 'text-lg'} font-manrope font-semibold mb-1`}>{label}</h2>
                <p className={`${isMobile ? 'text-md' : 'text-sm'} mb-4 font-manrope text-gray-600`}>{description}</p>
            </div>
        </div>
    );

    // If embedded (desktop two-column view)
    if (isEmbedded && !isMobile) {
        return (
            <div className="flex flex-col h-full bg-white">
                {/* Header */}
                <div className="px-4 py-4 border-black flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl lowercase text-black font-light font-manrope tracking-wide mb-2">
                            {title.toLowerCase()}
                        </h1>
                        <p className="text-sm font-manrope text-gray-600">{subtitle}</p>
                    </div>
                    <Button
                        onClick={() => navigate(`/chat/${conversationData.id}`)}
                        className="lowercase font-manrope bg-[#ded8d4] flex items-center justify-center gap-1 px-4 py-3 rounded-full text-[#292929] hover:bg-gray-100 transition shadow-lg"
                    >
                        Reopen Chat
                    </Button>
                </div>

                {/* Tabs - Same as mobile styling */}
                <div className="w-full flex-1 min-h-0 p-0">
                    <Tabs defaultValue="tab1" className="w-full h-full flex flex-col gap-0 p-0 m-0" onValueChange={setActiveTab}>
                        <TabsList className="flex p-0 h-14 w-full rounded-none bg-white">
                            {["tab1", "tab2", "tab3", "tab4"].map((tab, idx) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className={`basis-1/4 lowercase font-manrope max-w-[25%] px-4 py-2 h-14 border-black border-t border-b bg-white
                                        ${idx !== 3 ? "border-r" : ""}
                                        data-[state=active]:text-[#AA9C64] data-[state=active]:bg-white
                                        hover:bg-gray-50 transition-colors`}
                                >
                                    {tab === "tab1" && <>Closet ({closet.length})</>}
                                    {tab === "tab2" && <>Wishlist ({wishlist.length})</>}
                                    {tab === "tab3" && <>Cart ({cart.length})</>}
                                    {tab === "tab4" && <>Disliked ({disliked.length})</>}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        
                        <div className="flex-1 min-h-0 border-r border-b border-black">
                            {["tab1", "tab2", "tab3", "tab4"].map((tab) => (
                                <TabsContent
                                    key={tab}
                                    value={tab}
                                    className="p-0 m-0 h-full min-h-0 border-0"
                                >
                                    <div className="h-full min-h-0 flex flex-col overflow-auto">
                                        <ProductGrid
                                            products={
                                                tab === "tab1" ? closet :
                                                tab === "tab2" ? wishlist :
                                                tab === "tab3" ? cart : disliked
                                            }
                                            gridCols="grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
                                            emptyState={renderEmptyState(
                                                tab === "tab1" ? "Empty Closet" :
                                                tab === "tab2" ? "Empty Wishlist" :
                                                tab === "tab3" ? "Empty Cart" : "No Disliked Items",
                                                tab === "tab1" ? "No items were added to your Closet during this chat" :
                                                tab === "tab2" ? "No items were added to your Wishlist during this chat" :
                                                tab === "tab3" ? "No items were added to your Cart during this chat" :
                                                "No items were disliked during this chat"
                                            )}
                                            onProductClick={(idx) => {
                                                setModalItemIdx(idx);
                                                setModalOpen(true);
                                            }}
                                            onHeartClick={handleHeartClick}
                                            wishlistedItems={localWishlist}
                                            showHeart
                                        />
                                    </div>
                                </TabsContent>
                            ))}
                        </div>
                    </Tabs>
                </div>

                {/* MainModal */}
                <MainModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    item={modalItemIdx !== null ? modalItems[modalItemIdx] : null}
                    itemIdx={modalItemIdx}
                    items={modalItems}
                    wishlist={modalWishlist}
                    onWishlist={handleWishlist}
                    cart={modalCart}
                    onAddToCart={handleAddToCart}
                />
            </div>
        );
    }

    // Mobile/standalone layout
    return (
        <PageLayout className="bg-white">
            <div className="w-full h-full min-h-screen flex flex-col max-w-screen-xl md:max-w-full mx-auto relative">
                <div className="flex justify-start items-start text-lg px-4 py-4 gap-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center mt-1 justify-start text-black hover:text-[#AA9C64] transition"
                        aria-label="Back to conversation history"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="px-1 pb-2">
                        <h1 className="text-2xl md:text-2xl lowercase text-black font-light font-manrope tracking-wide">
                            conversation summary
                        </h1>
                        <p className='text-sm font-manrope text-gray-600'>{subtitle}</p>
                    </div>
                </div>
                
                <div className="w-full flex-1 min-h-0 p-0">
                    <Tabs defaultValue="tab1" className="w-full h-full flex flex-col gap-0 p-0 m-0" onValueChange={setActiveTab}>
                        <TabsList className="flex p-0 h-14 w-full rounded-none bg-white">
                            {["tab1", "tab2", "tab3", "tab4"].map((tab, idx) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className={`basis-1/4 lowercase font-manrope max-w-[25%] px-4 py-2 h-14 border-black border-t bg-white
                                        ${idx !== 3 ? "border-r" : ""}
                                        data-[state=active]:text-[#AA9C64] data-[state=active]:bg-white
                                        hover:bg-gray-50 transition-colors`}
                                >
                                    {tab === "tab1" && <>Closet ({closet.length})</>}
                                    {tab === "tab2" && <>Wishlist ({wishlist.length})</>}
                                    {tab === "tab3" && <>Cart ({cart.length})</>}
                                    {tab === "tab4" && <>Disliked ({disliked.length})</>}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        
                        <div className="flex-1 min-h-0 border-l border-t border-r border-b border-black">
                            {["tab1", "tab2", "tab3", "tab4"].map((tab) => (
                                <TabsContent
                                    key={tab}
                                    value={tab}
                                    className="p-0 m-0 h-full min-h-0 border-0"
                                >
                                    <div className="h-full min-h-0 flex flex-col overflow-auto p-0 m-0">
                                        <ProductGrid
                                            products={
                                                tab === "tab1" ? closet :
                                                tab === "tab2" ? wishlist :
                                                tab === "tab3" ? cart : disliked
                                            }
                                            gridCols="grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
                                            emptyState={renderEmptyState(
                                                tab === "tab1" ? "Empty Closet" :
                                                tab === "tab2" ? "Empty Wishlist" :
                                                tab === "tab3" ? "Empty Cart" : "No Disliked Items",
                                                tab === "tab1" ? "No items were added to your Closet during this chat" :
                                                tab === "tab2" ? "No items were added to your Wishlist during this chat" :
                                                tab === "tab3" ? "No items were added to your Cart during this chat" :
                                                "No items were disliked during this chat"
                                            )}
                                            onProductClick={(idx) => {
                                                setModalItemIdx(idx);
                                                setModalOpen(true);
                                            }}
                                            onHeartClick={handleHeartClick}
                                            wishlistedItems={localWishlist}
                                            showHeart
                                        />
                                    </div>
                                </TabsContent>
                            ))}
                        </div>
                    </Tabs>
                </div>
                
                {/* Floating Reopen Chat Button */}
                <div className="fixed bottom-0 left-0 w-full flex justify-center z-20 pointer-events-none">
                    <div className="max-w-screen-xl md:max-w-full w-full flex justify-center items-center px-4 pb-4 pointer-events-auto">
                        <Button
                            onClick={() => navigate('/chat/' + conversationData.id)}
                            className="w-full md:w-1/5 lowercase font-manrope bg-[#ded8d4] opacity-90 flex items-center justify-center gap-1 px-4 py-3 rounded-full text-[#292929] hover:bg-gray-100 transition shadow-lg"
                        >
                            Reopen Chat
                        </Button>
                    </div>
                </div>
            </div>
            
            <MainModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                item={modalItemIdx !== null ? modalItems[modalItemIdx] : null}
                itemIdx={modalItemIdx}
                items={modalItems}
                wishlist={modalWishlist}
                onWishlist={handleWishlist}
                cart={modalCart}
                onAddToCart={handleAddToCart}
            />
        </PageLayout>
    )
}

export default ConversationSummary