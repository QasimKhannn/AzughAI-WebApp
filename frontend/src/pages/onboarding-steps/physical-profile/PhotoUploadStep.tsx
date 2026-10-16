import React from "react";
import { ArrowRight } from "lucide-react";
import UploadBox from "@/components/onboarding/physical-profile/UploadBox";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";

const PhotoUploadStep: React.FC = () => {
    const [images, setImages] = React.useState<(string | null)[]>([null, null, null]);
    const fileInputs = [
        React.useRef<HTMLInputElement>(null),
        React.useRef<HTMLInputElement>(null),
        React.useRef<HTMLInputElement>(null),
    ];
    const { goToNext, goToPrev } = useRoutesContext();

    const handleUpload = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = ev => {
                setImages(imgs => {
                    const newImgs = [...imgs];
                    newImgs[i] = ev.target?.result as string;
                    return newImgs;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = (i: number) => {
        setImages(imgs => {
            const newImgs = [...imgs];
            newImgs[i] = null;
            return newImgs;
        });
    };

    const handleContinue = () => {
        const anyImage = images.some(Boolean);
        localStorage.setItem("photosUploaded", anyImage.toString());
        goToNext();
    };

    const anyImage = images.some(Boolean);
    const uploadLabel = "Please, upload a photo in natural light, selfies & full body if possible.";

    return (
        <QuizStepLayout
            childrenClassName="justify-start items-center pt-16"
            bgImage="/assets/physical-mb-bg.png"
            progress={{ current: 1, total: 6 }}
            onBack={goToPrev}
            onContinue={handleContinue}
        >
            <div className="bg-white rounded-2xl shadow-2xl border border-[#DED8D4] p-4 sm:p-6 flex flex-col items-center relative overflow-visible">
                <div className="absolute left-1/2 -translate-x-1/2 -top-8 sm:-top-10 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                    <img
                        src="/assets/physical-box-ico.png"
                        alt="Physical Profile"
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border-4 border-white shadow"
                    />
                </div>
                <div className="w-full mb-3 sm:mb-4 mt-6 sm:mt-8">
                    <p className="text-[#292929] font-manrope text-center text-sm sm:text-base font-[400] px-2">
                        {uploadLabel}
                    </p>
                </div>
                <div className="flex flex-row justify-center space-x-3 items-center gap-2 sm:gap-3 w-full mb-3 sm:mb-4">
                    {images.map((img, i) => (
                        <UploadBox
                            key={i}
                            image={img}
                            index={i}
                            onUpload={handleUpload}
                            onRemove={handleRemove}
                            fileInputRef={fileInputs[i]}
                        />
                    ))}
                </div>
                {!anyImage && (
                    <button
                        className="mt-2 text-[#4F4F4F] font-[400] bg-transparent border-none shadow-none text-sm sm:text-base"
                        onClick={handleContinue}
                    >
                        Skip
                    </button>
                )}
                {anyImage && (
                    <button
                        className="mt-2 flex items-center justify-center rounded-full bg-[#303A2FB2] text-[#F0EDEB] font-semibold text-sm sm:text-base h-10 w-20"
                        onClick={handleContinue}
                    >
                        <ArrowRight className="w-6 h-6 sm:w-6 sm:h-6" />
                    </button>
                )}
            </div>
        </QuizStepLayout>
    );
};

export default PhotoUploadStep;
