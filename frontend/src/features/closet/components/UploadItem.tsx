import { useRef, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, Plus } from 'lucide-react';
import { useClosetStore } from '../store/closetStore';
import { cn } from '@/lib/utils';
import GalleryImagePicker, { GalleryImagePickerRef } from './GalleryImagePicker';
import { useNavigate } from 'react-router-dom';
import ImageIcon from '@/components/icons/ImageIcon';
import ClosetLoader from './ClosetLoader';
import { AnimatePresence } from 'framer-motion';
import BottomSheet from './BottomSheet';
import { Separator } from '@/components/ui/separator';

const UploadItem = () => {
    const { addImages, capturedImages, removeImage } = useClosetStore();
    const [displayedImageIndex, setDisplayedImageIndex] = useState(0);
    const [showLoader, setShowLoader] = useState(false);
    const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
    const galleryPickerRef = useRef<GalleryImagePickerRef | null>(null);
    const cameraPickerRef = useRef<GalleryImagePickerRef | null>(null); // <-- NEW
    const [showAndroidPicker, setShowAndroidPicker] = useState(false);
    const navigate = useNavigate();

    const handleGalleryImages = (images: string[]) => {
        addImages(images);
    };

    const handleRemoveImage = (index: number) => {
        removeImage(index);
        if (displayedImageIndex >= capturedImages.length) {
            setDisplayedImageIndex(Math.max(0, capturedImages.length - 1));
        }
    };

    const handleConfirm = () => {
        if (capturedImages.length === 0) return;
        setShowLoader(true);
        setTimeout(() => {
            setShowLoader(false);
            navigate('/closet/matches');
        }, 4000);
    }

    if (showLoader) {
        return <ClosetLoader />
    }

    return (
        <div className="w-full relative min-h-screen flex flex-col pb-[20vh] max-w-screen-xl md:max-w-full mx-auto bg-white">
            <ArrowLeft onClick={() => navigate(-1)} className='absolute left-4 mt-4' />
            <div className="flex-1 flex flex-col items-center justify-top py-2 mt-8 max-h-[60vh] mb-0">
                <div className='text-center mb-4'>
                    <p className='text-2xl md:text-2xl text-black lowercase font-light'>take photos</p>
                    <p className='text-lg lowercase font-light'>capture your item clearly</p>
                </div>
                {capturedImages.length === 0 ? (
                    <div className='text-center px-2'>
                        <ImageIcon name='add-items.svg' className="w-auto max-w-xs h-32 md:h-40 text-gray-400 mb-8 mx-auto" />
                        <p className='text-2xl md:text-2xl text-black lowercase font-light'>add at least one photo of your item</p>
                        <p className='text-lg lowercase font-light'>snap or upload your item to start</p>
                    </div>
                ) : (
                    <>
                        <div className="w-[85%] max-w-2xl aspect-[4/3] mb-6 border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                            <img
                                src={capturedImages[displayedImageIndex]}
                                alt="Main captured item"
                                className="w-full h-full object-cover"
                                style={{ aspectRatio: '4/3' }}
                            />
                        </div>
                        <div className="flex flex-row w-[85%] max-w-2xl gap-3 mb-0 overflow-x-auto whitespace-nowrap">
                            {capturedImages.map((image, index) => (
                                <div key={index}
                                    className={cn(
                                        "aspect-square w-16 md:w-20 flex-shrink-0 overflow-hidden border relative",
                                        index === displayedImageIndex ? "border-gray-600" : "border-gray-200"
                                    )}
                                    onClick={() => setDisplayedImageIndex(index)}
                                >
                                    <img
                                        src={image}
                                        alt={`Captured item ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        className="absolute bg-white text-lg text-black -top-1 right-0 w-4 h-5 bg-transparent flex items-center justify-center hover:bg-gray-900"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveImage(index);
                                        }}
                                        type="button"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button
                                className="aspect-square w-16 md:w-20 flex-shrink-0 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 border border-gray-200"
                                onClick={() => {
                                    if (isAndroid) setShowAndroidPicker(true);   // show Android-only dropdown
                                    else galleryPickerRef.current?.open();       // iOS shows native sheet
                                }}
                                type="button"
                            >
                                <Plus className="w-6 h-6 text-gray-600" />
                                <p className='text-xs font-light lowercase text-gray-600'>add</p>
                            </button>
                        </div>
                    </>
                )}
            </div>
            <div className="flex flex-col items-center justify-center gap-3 px-4 pb-8 mt-2">
                {capturedImages.length === 0 ? (
                    <Button
                        className="h-12 w-1/2 md:w-1/5 bg-[#303A2FB2] hover:bg-[#303A2FB2] text-white font-manrope flex justify-between px-8 lowercase rounded-full"
                        onClick={() => {
                            if (isAndroid) setShowAndroidPicker(true);   // show Android-only dropdown
                            else galleryPickerRef.current?.open();       // iOS shows native sheet
                        }}
                    >
                        <Camera style={{ width: 18, height: 18 }} />
                        Upload Image
                    </Button>
                ) : (
                    <Button
                        type="button"
                        className="h-12 w-[50%] max-w-sm mx-auto rounded-full bg-[#303A2FB2] hover:bg-[#303A2FB2] text-white font-light text-base transition
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#303A2F]
             disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleConfirm}
                        disabled={capturedImages.length === 0 || showLoader}
                        aria-disabled={capturedImages.length === 0 || showLoader}
                    >
                        Confirm
                    </Button>

                )}
            </div>
            {/* iOS & Android gallery picker (no capture) */}
            <GalleryImagePicker
                ref={galleryPickerRef}
                onImagesSelected={handleGalleryImages}
            />

            {/* Android camera picker (with capture) */}
            <GalleryImagePicker
                ref={cameraPickerRef}
                onImagesSelected={handleGalleryImages}
                camera
            />
            <AnimatePresence>
                {isAndroid && (
                    <BottomSheet open={showAndroidPicker} onClose={() => setShowAndroidPicker(false)}>
                        <Button
                            className="w-full py-4 text-base lowercase font-light"
                            onClick={() => {
                                setShowAndroidPicker(false);
                                cameraPickerRef.current?.open(); // opens camera via capture
                            }}
                        >
                            Take Photo
                        </Button>
                        <Separator className="bg-gray-200 w-full px-0 mx-0" />
                        <Button
                            className="w-full py-4 text-base lowercase font-light"
                            onClick={() => {
                                setShowAndroidPicker(false);
                                galleryPickerRef.current?.open(); // opens gallery/files
                            }}
                        >
                            Photo Gallery
                        </Button>
                        <Separator className="bg-gray-300 w-full px-0 mx-0" />
                        <Button
                            variant="ghost"
                            className="w-full py-4 text-base lowercase font-light"
                            onClick={() => setShowAndroidPicker(false)}
                        >
                            Cancel
                        </Button>
                    </BottomSheet>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UploadItem;