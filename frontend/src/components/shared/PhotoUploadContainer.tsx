import React, { useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import UploadBox from "@/components/onboarding/physical-profile/UploadBox";

const MIN_BOXES = 3;

interface PhotoUploadContainerProps {
  images: (string | null)[];
  onImageChange: (newImages: (string | null)[]) => void;
  uploadLabel: string;
  iconSrc?: string;
  iconAlt?: string;
  onContinue: () => void;
  showSkip?: boolean;
  continueButtonText?: React.ReactNode;
  skipButtonText?: string;
}

const PhotoUploadContainer: React.FC<PhotoUploadContainerProps> = ({
  images,
  onImageChange,
  uploadLabel,
  iconSrc = "/assets/creatives/upload_image.png",
  iconAlt = "Upload Photos",
  onContinue,
  showSkip = true,
  continueButtonText = <ArrowRight className="w-6 h-6 sm:w-6 sm:h-6" />,
  skipButtonText = "Skip",
}) => {
  // Ensure at least three boxes
  const displayImages = [...images];
  // Always show at least three boxes
  while (displayImages.length < MIN_BOXES) {
    displayImages.push(null);
  }

  // Only create refs once, not on every render
  const fileInputsRef = useRef<(React.RefObject<HTMLInputElement>)[]>([]);
  if (fileInputsRef.current.length !== displayImages.length) {
    while (fileInputsRef.current.length < displayImages.length) {
      fileInputsRef.current.push(React.createRef<HTMLInputElement>());
    }
    while (fileInputsRef.current.length > displayImages.length) {
      fileInputsRef.current.pop();
    }
  }

  const handleUpload = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`[PhotoUploadContainer] UploadBox triggered for index ${i}`);
    if (!e.target.files) {
      console.warn(`[PhotoUploadContainer] No files property on input event for index ${i}`);
      return;
    }
    const file = e.target.files[0];
    if (!file) {
      console.warn(`[PhotoUploadContainer] No file selected for index ${i}`);
      return;
    }
    console.log(`[PhotoUploadContainer] handleUpload called for index ${i}`, file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      console.log(`[PhotoUploadContainer] FileReader loaded for index ${i}`, ev.target?.result);
      const newImages = [...images];
      if (i < newImages.length) {
        newImages[i] = ev.target?.result as string;
      } else {
        newImages.push(ev.target?.result as string);
      }
      onImageChange(newImages);
    };
    reader.onerror = (err) => {
      console.error(`[PhotoUploadContainer] FileReader error for index ${i}`, err);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (i: number) => {
    // Remove the image and shift others left
    const newImages = images.filter((_, idx) => idx !== i);
    onImageChange(newImages);
  };

  // Add new image slot with file picker
  const handleAddImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          onImageChange([...images, ev.target?.result as string]);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const anyImage = images.some(Boolean);

  // Ref for the scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to right when images change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [displayImages.length, displayImages]); // <-- watch displayImages

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-[#DED8D4] p-4 sm:p-6 flex flex-col items-center relative overflow-visible w-full max-w-[80vw] md:max-w-full">
      <div className="absolute left-1/2 -translate-x-1/2 -top-8 sm:-top-10 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
        <img
          src={iconSrc}
          alt={iconAlt}
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border-4 border-white shadow"
        />
      </div>
      <div className="w-full mb-3 sm:mb-4 mt-6 sm:mt-8">
        <p className="text-[#292929] font-manrope text-center text-sm sm:text-base font-[400] px-2">
          {uploadLabel}
        </p>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex flex-row items-center gap-1 sm:gap-2 hide-scrollbar mb-3 sm:mb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-[#DED8D4] scrollbar-track-transparent"
        style={{
          width: "100%",
          maxWidth: "400px",
          minWidth: "320px",
          paddingRight: "8px",
        }}
      >
        {displayImages.map((img, i) => (
          <div key={i} style={{ minWidth: "110px", maxWidth: "110px" }}>
            <UploadBox
              image={img}
              index={i}
              onUpload={handleUpload}
              onRemove={handleRemove}
              fileInputRef={fileInputsRef.current[i]}
            />
          </div>
        ))}
        {/* Extra "+" box only if all are filled */}
        {displayImages.every(Boolean) && (
          <div style={{ minWidth: "110px", maxWidth: "110px" }}>
            <UploadBox
              image={null}
              index={displayImages.length}
              onUpload={handleUpload}
              onRemove={() => {}}
              fileInputRef={fileInputsRef.current[displayImages.length] || React.createRef<HTMLInputElement>()}
            />
          </div>
        )}
      </div>
      {!anyImage && showSkip && (
        <button
          className="mt-2 text-[#4F4F4F] font-[400] bg-transparent border-none shadow-none text-sm sm:text-base"
          onClick={onContinue}
        >
          {skipButtonText}
        </button>
      )}
      {anyImage && (
        <button
          className="mt-2 flex items-center justify-center rounded-full bg-[#303A2FB2] text-[#F0EDEB] font-semibold text-sm sm:text-base h-10 w-20"
          onClick={onContinue}
        >
          {continueButtonText}
        </button>
      )}
    </div>
  );
};

export default PhotoUploadContainer;
