import React from "react";
import { Plus, X } from "lucide-react";

interface UploadBoxProps {
    image: string | null;
    index: number;
    onUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: (index: number) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

const UploadBox: React.FC<UploadBoxProps> = ({
    image,
    index,
    onUpload,
    onRemove,
    fileInputRef
}) => (
    <div className="relative">
        <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onClick={() => {
                console.log(`[UploadBox] File input clicked for index ${index}`);
            }}
            onChange={(e) => {
                console.log(`[UploadBox] File input changed for index ${index}`, e.target.files);
                onUpload(index, e);
                // Reset input value so selecting the same file again triggers onChange
                e.target.value = "";
            }}
            className="hidden"
        />
        {!image ? (
            <button
                type="button"
                onClick={() => {
                    console.log(`[UploadBox] "+" button clicked for index ${index}`);
                    fileInputRef.current?.click();
                }}
                className="flex items-center justify-center w-20 h-28 sm:w-24 sm:h-32 rounded-xl bg-[#4E2B251A] transition-all cursor-pointer"
            >
                <Plus className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: "#4E2B25B2" }} />
            </button>
        ) : (
            <div className="relative w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-visible border border-[#DED8D4]">
                <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-contain rounded-xl bg-white p-2"
                />
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="absolute top-0 -right-1.5 w-5 h-5 bg-[#292929] rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-md"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }} // Increased z-index
                >
                    <X className="w-3 h-3 text-white" />
                </button>
            </div>
        )}
    </div>
);

export default UploadBox;
