import React from "react";
import { useAzughContext } from "@/context";
import Button from "@/components/common/button/Button";
import { Plus, ArrowRight } from "lucide-react";

interface UploadClosetWidgetProps {
    onContinue?: () => void;
    onSkip?: () => void;
    inviteMessage?: string;
    qrCodeSrc?: string;
    finishedButtonText?: string;
    skipButtonText?: string;
    iconSrc?: string;
    iconAlt?: string;
    mobileUploadLabel?: string;
}

const useIsMobile = () => {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor;
            const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
                userAgent.toLowerCase()
            );
            const isSmallScreen = window.innerWidth <= 768;
            setIsMobile(isMobileDevice || isSmallScreen);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return isMobile;
};

const UploadClosetWidget: React.FC<UploadClosetWidgetProps> = ({
    onContinue = () => { },
    onSkip = () => { },
    inviteMessage = "Scan the QR code to upload your closet from your phone",
    qrCodeSrc = "/assets/qr/closet.png",
    finishedButtonText = "Finished",
    skipButtonText = "Skip",
    iconSrc = "/assets/creatives/upload_image.png",
    iconAlt = "Upload Closet",
    mobileUploadLabel = "Upload items from your closet",
}) => {
    const { setMessages, setLoading } = useAzughContext();
    const isMobile = useIsMobile();
    const [closetItems, setClosetItems] = React.useState<string[]>([]);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const handleContinue = async () => {
        setLoading(true);
        await delay(1000);
        setMessages(prev => [
            ...prev,
            {
                sender: "assistant",
                text: "Great! Your closet has been uploaded successfully. Let's continue with your style profile."
            }
        ]);
        setLoading(false);
        if (onContinue) {
            onContinue();
        }
    };

    const handleSkip = async () => {
        setLoading(true);
        await delay(1000);
        setMessages(prev => [
            ...prev,
            {
                sender: "assistant",
                text: "No problem! We can always add your closet items later. Let's continue with your style profile."
            }
        ]);
        setLoading(false);
        if (onSkip) {
            onSkip();
        }
    };

    const handleAddItem = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e: any) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    setClosetItems(prev => [...prev, ev.target?.result as string]);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const handleRemoveItem = (index: number) => {
        setClosetItems(prev => prev.filter((_, i) => i !== index));
    };

    const hasItems = closetItems.length > 0;

    // Mobile: show closet upload container
    if (isMobile) {
        return (
            <div className="bg-white rounded-2xl shadow-2xl border border-[#DED8D4] p-4 sm:p-6 flex flex-col items-center relative overflow-visible w-full max-w-[80vw] md:max-w-full">
                {/* Icon at top */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-8 sm:-top-10 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                    <img
                        src={iconSrc}
                        alt={iconAlt}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border-4 border-white shadow"
                    />
                </div>

                {/* Label */}
                <div className="w-full mb-3 sm:mb-4 mt-6 sm:mt-8">
                    <p className="text-[#292929] font-manrope text-center text-sm sm:text-base font-[400] px-2">
                        {mobileUploadLabel}
                    </p>
                </div>

                {/* Items grid or Add Item button */}
                <div className="w-full mb-3 sm:mb-4">
                    {hasItems ? (
                        <div className="flex flex-row items-center gap-2 overflow-x-auto hide-scrollbar pb-2" style={{ maxWidth: "100%" }}>
                            {closetItems.map((item, index) => (
                                <div key={index} className="relative min-w-[80px] max-w-[80px] h-[80px]">
                                    <img
                                        src={item}
                                        alt={`Closet item ${index + 1}`}
                                        className="w-full h-full object-cover rounded-lg border border-[#DED8D4]"
                                    />
                                    <button
                                        onClick={() => handleRemoveItem(index)}
                                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            {/* Add more button */}
                            <button
                                onClick={handleAddItem}
                                className="min-w-[80px] max-w-[80px] h-[80px] border-2 border-dashed border-[#DED8D4] rounded-lg flex items-center justify-center text-[#4F4F4F] hover:border-[#303A2F] transition-colors"
                            >
                                <Plus className="w-6 h-6" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAddItem}
                            className="w-full py-4 border-2 border-dashed border-[#DED8D4] rounded-lg flex items-center justify-center gap-2 text-[#4F4F4F] hover:border-[#303A2F] transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="text-sm font-[400]">Add Item</span>
                        </button>
                    )}
                </div>

                {/* Action buttons */}
                {!hasItems && (
                    <button
                        className="mt-2 text-[#4F4F4F] font-[400] bg-transparent border-none shadow-none text-sm sm:text-base"
                        onClick={handleSkip}
                    >
                        {skipButtonText}
                    </button>
                )}
                {hasItems && (
                    <button
                        className="mt-2 flex items-center justify-center rounded-full bg-[#303A2FB2] text-[#F0EDEB] font-semibold text-sm sm:text-base h-10 w-20"
                        onClick={handleContinue}
                    >
                        <ArrowRight className="w-6 h-6" />
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-lg p-6">
                {/* Invite Message */}
                <div className="text-center mb-6">
                    <p className="text-base text-gray-600 font-light">
                        {inviteMessage}
                    </p>
                </div>

                {/* QR Code Container */}
                <div className="flex justify-center items-center mb-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <img
                            src={qrCodeSrc}
                            alt="Closet Upload QR Code"
                            className="w-48 h-48 object-contain"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 w-full">
                    <Button
                        onClick={handleContinue}
                        label={finishedButtonText}
                        variant="primary"
                        className="font-light w-full bg-[#303A2FB2] text-white"
                    />
                    <Button
                        onClick={handleSkip}
                        label={skipButtonText}
                        variant="primary"
                        className="font-light w-full"
                    />
                </div>
            </div>
        </div>
    );

    // Desktop: show QR code
}
export default UploadClosetWidget;