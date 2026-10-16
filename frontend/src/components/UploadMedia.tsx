import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Camera, Upload, X, Loader2, RefreshCw } from "lucide-react";
import { UserProfileService } from '@/services/UserProfileService';

interface UploadMediaProps {
    onClose: () => void;
    onSuccess: (skinTone: string) => void;
}

export const UploadMedia: React.FC<UploadMediaProps> = ({ onClose, onSuccess }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCameraMode, setIsCameraMode] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        // Clean up function to stop the camera stream when component unmounts
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        setError(null);
        setIsCameraMode(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            setError('Unable to access camera. Please ensure you have granted camera permissions.');
            setIsCameraMode(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraMode(false);
    };

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current && streamRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Draw the current video frame onto the canvas
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Convert canvas to blob to create a File object
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
                        setSelectedFile(file);
                        
                        // Create object URL for preview
                        const objectUrl = URL.createObjectURL(blob);
                        setPreviewUrl(objectUrl);
                        
                        // Stop the camera stream
                        stopCamera();
                    }
                }, 'image/jpeg', 0.95);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Check file type
            if (!file.type.match('image.*')) {
                setError('Please select an image file');
                return;
            }
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('File is too large. Please select an image less than 5MB');
                return;
            }

            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleCameraCapture = () => {
        startCamera();
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            setError('Please select an image first');
            return;
        }

        setIsLoading(true);
        try {
            // Placeholder for API call to backend for skin tone detection
            // Replace this with actual implementation later
            
            // Simulating API call with timeout
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // For now, just return a random skin tone from the predefined list
            const skinTones = ["Fair", "Light", "Medium", "Olive", "Tan", "Deep", "Rich Ebony"];
            const detectedSkinTone = skinTones[Math.floor(Math.random() * skinTones.length)];
            
            // Update user profile with detected skin tone
            UserProfileService.getInstance().updateProfile('skinColor', detectedSkinTone);
            
            // Call the onSuccess callback with the detected skin tone
            onSuccess(detectedSkinTone);
        } catch (err) {
            console.error('Error detecting skin tone:', err);
            setError('An error occurred while detecting skin tone. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-azugh-accent font-manrope">Detect Your Skin Tone</DialogTitle>
                    <DialogDescription className="text-left text-azugh-text/50">
                        {isCameraMode ? 
                            "Take a photo in good lighting for accurate skin tone detection" : 
                            "Upload a selfie or photo in good lighting for accurate skin tone detection"}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center space-y-4 mb-2">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        ref={fileInputRef}
                    />

                    {/* Camera Mode UI */}
                    {isCameraMode && (
                        <div className="flex flex-col space-y-4 w-full items-center">
                            <div className="relative w-full bg-black rounded-md overflow-hidden">
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline
                                    className="w-full h-64 object-cover"
                                />
                                <canvas ref={canvasRef} className="hidden" />
                            </div>
                            
                            <div className="flex space-x-4">
                                <Button 
                                    variant="outline" 
                                    onClick={stopCamera}
                                    className="flex items-center gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>
                                
                                <Button 
                                    onClick={takePhoto}
                                    className="flex items-center gap-2 bg-azugh-accent hover:bg-azugh-accent/90 text-white"
                                >
                                    <Camera className="h-4 w-4" />
                                    Capture
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Upload UI */}
                    {!isCameraMode && !previewUrl && (
                        <div className="flex flex-col space-y-4 w-full">
                            <Button 
                                variant="outline" 
                                onClick={handleCameraCapture} 
                                className="w-full border-dashed h-24 flex flex-col gap-2"
                            >
                                <Camera className="h-6 w-6" />
                                <span>Take a Selfie</span>
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                onClick={handleUploadClick}
                                className="w-full border-dashed h-24 flex flex-col gap-2"
                            >
                                <Upload className="h-6 w-6" />
                                <span>Upload from Device</span>
                            </Button>
                        </div>
                    )}

                    {/* Preview UI */}
                    {previewUrl && (
                        <div className="relative w-full">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-64 object-contain rounded-md"
                            />
                            <div className="absolute top-2 right-2 flex space-x-2">
                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => {
                                        handleRemoveFile();
                                        setIsCameraMode(false);
                                    }}
                                    className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
                                >
                                    <X className="h-4 w-4 text-white" />
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => {
                                        handleRemoveFile();
                                        handleCameraCapture();
                                    }}
                                    className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
                                >
                                    <RefreshCw className="h-4 w-4 text-white" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                </div>

                <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={!selectedFile || isLoading}
                        className="bg-azugh-accent hover:bg-azugh-accent/90 disabled:opacity-80 text-white"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Detecting...
                            </>
                        ) : "Detect Skin Tone"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UploadMedia;