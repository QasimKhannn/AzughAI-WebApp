import React from "react";
import PhotoUploadContainer from "@/components/shared/PhotoUploadContainer";
import Button from "@/components/common/button/Button";
import { useAzughContext } from "@/context";

interface UploadImageWidgetProps {
    onImagesUploaded?: (images: (string | null)[]) => void;
    onContinue?: () => void;
    uploadLabel?: string;
    iconSrc?: string;
    iconAlt?: string;
    maxImages?: number;
    showSkip?: boolean;
    skipButtonText?: string;
    qrCodeSrc?: string;
    qrInviteMessage?: string;
    finishedButtonText?: string;
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

const UploadImageWidget: React.FC<UploadImageWidgetProps> = ({
    onImagesUploaded,
    onContinue = () => { },
    uploadLabel = "Please, upload your photos here",
    iconSrc = "/assets/creatives/upload_image.png",
    iconAlt = "Upload Photos",
    maxImages = 3,
    showSkip = true,
    skipButtonText = "Skip",
    qrCodeSrc = "/assets/qr/closet.png",
    qrInviteMessage = "Scan the QR code to upload your photos from your phone",
    finishedButtonText = "Finished",
}) => {
    const [images, setImages] = React.useState<(string | null)[]>(Array(maxImages).fill(null));
    const { setMessages, setLoading } = useAzughContext();
    const isMobile = useIsMobile();

    const handleImageChange = (newImages: (string | null)[]) => {
        setImages(newImages);
        if (onImagesUploaded) {
            onImagesUploaded(newImages);
        }
    };
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const handleContinue = async () => {
        setLoading(true);
        await delay(1000);
        const message = "Looking gorgeous. So finally, let's talk aesthetics, this is where your style really comes alive. Would you mind choosing the looks below that speak to you. No pressure, no wrong answers, just pick what feels like you";
        setMessages(prev => [
            ...prev,
            {
                sender: "assistant",
                text: message
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
                text: "No problem! We can always add your photos later. Let's continue with your style profile."
            }
        ]);
        setLoading(false);
        if (onContinue) {
            onContinue();
        }
    };

    // Desktop: show QR code
    if (!isMobile) {
        return (
            <div className="w-full max-w-md mx-auto">
                <div className="bg-white rounded-lg p-6">
                    {/* Invite Message */}
                    <div className="text-center mb-6">
                        <p className="text-base text-gray-600 font-light">
                            {qrInviteMessage}
                        </p>
                    </div>

                    {/* QR Code Container */}
                    <div className="flex justify-center items-center mb-6">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <img
                                src={qrCodeSrc}
                                alt="Photo Upload QR Code"
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
                        {showSkip && (
                            <Button
                                onClick={handleSkip}
                                label={skipButtonText}
                                variant="primary"
                                className="font-light w-full"
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Mobile: show PhotoUploadContainer
    return (
        <PhotoUploadContainer
            images={images}
            onImageChange={handleImageChange}
            uploadLabel={uploadLabel}
            iconSrc={iconSrc}
            iconAlt={iconAlt}
            onContinue={handleContinue}
            showSkip={showSkip}
            skipButtonText={skipButtonText}
        />
    );
};

export default UploadImageWidget;