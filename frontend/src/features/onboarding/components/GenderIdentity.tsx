import React, { useEffect, useState } from "react";
import DefaultOptions from "@/components/onboarding/personal-identity/DefaultOptions";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useUpdateAzughAccount } from "@/features/auth/hooks/useAuthQueries";
import { Gender, AestheticType } from "@/features/auth/types";
import { toast } from "sonner";

interface GenderOption {
    label: string;
    value: Gender;
}

interface AestheticOption {
    label: string;
    value: AestheticType;
}

const GENDER_OPTIONS: GenderOption[] = [
    { label: "Woman", value: "woman" },
    { label: "Man", value: "man" },
    { label: "Non-binary", value: "non-binary" },
    { label: "Gender-fluid", value: "gender-fluid" },
    { label: "Prefer not to say", value: "prefer-not-to-say" },
];

const AESTHETIC_OPTIONS: AestheticOption[] = [
    { label: "Masculine", value: "masculine" },
    { label: "Feminine", value: "feminine" },
    { label: "Both", value: "both" },
];

const AVAILABLE_AESTHETICS: Record<Gender, AestheticType[]> = {
    woman: ["feminine"],
    man: ["masculine"],
    "non-binary": ["masculine", "feminine", "both"],
    "gender-fluid": ["masculine", "feminine", "both"],
    "prefer-not-to-say": ["masculine", "feminine", "both"],
};

const GenderIdentityStep: React.FC = () => {
    const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
    const [selectedAesthetic, setSelectedAesthetic] = useState<AestheticType | null>(null);
    const { goToNext, goToPrev } = useRoutesContext();
    const { azughAccount } = useAuth();
    const { mutate: updateAzughAccount, isPending } = useUpdateAzughAccount();

    // Load existing gender from azughAccount
    useEffect(() => {
        if (azughAccount?.gender) {
            setSelectedGender(azughAccount.gender);
        }
        // TODO: Load aesthetic preference when BE support is added
        // if (azughAccount?.aesthetic_preference) {
        //     setSelectedAesthetic(azughAccount.aesthetic_preference);
        // }
    }, [azughAccount]);

    const needsAestheticSelection = selectedGender && 
        ["non-binary", "gender-fluid", "prefer-not-to-say"].includes(selectedGender);

    const availableAesthetics = selectedGender 
        ? AVAILABLE_AESTHETICS[selectedGender] 
        : [];

    const filteredAestheticOptions = AESTHETIC_OPTIONS.filter(option => 
        availableAesthetics.includes(option.value)
    );

    const handleContinue = async () => {
        if (!selectedGender) {
            toast.error("Please select your gender identity");
            return;
        }

        if (needsAestheticSelection && !selectedAesthetic) {
            toast.error("Please select your aesthetic preference");
            return;
        }

        // Update gender in backend
        await updateAzughAccount(
            { gender: selectedGender },
            {
                onSuccess: () => {
                    // TODO: Update aesthetic preference when BE support is added
                    // if (selectedAesthetic) {
                    //     updateAzughAccount({ aesthetic_preference: selectedAesthetic });
                    // }
                    
                    // Temporarily store aesthetic in localStorage
                    if (selectedAesthetic) {
                        localStorage.setItem("aestheticType", selectedAesthetic);
                    }
                    
                    goToNext();
                },
                onError: (error) => {
                    console.error("Failed to update gender:", error);
                    toast.error("Failed to save gender identity. Please try again.");
                }
            }
        );
    };

    const handleGenderChange = (label: string) => {
        const option = GENDER_OPTIONS.find(opt => opt.label === label);
        if (option) {
            setSelectedGender(option.value);
            // Reset aesthetic if new gender doesn't support current selection
            if (selectedAesthetic && !AVAILABLE_AESTHETICS[option.value].includes(selectedAesthetic)) {
                setSelectedAesthetic(null);
            }
        }
    };

    const handleAestheticChange = (label: string) => {
        const option = AESTHETIC_OPTIONS.find(opt => opt.label === label);
        if (option) {
            setSelectedAesthetic(option.value);
        }
    };

    const selectedGenderLabel = GENDER_OPTIONS.find(opt => opt.value === selectedGender)?.label || null;
    const selectedAestheticLabel = AESTHETIC_OPTIONS.find(opt => opt.value === selectedAesthetic)?.label || null;

    return (
        <QuizStepLayout
            progress={{ current: 1, total: 3 }}
            questionLabel="How do you identify?"
            showBack={true}
            onBack={goToPrev}
            onContinue={handleContinue}
            disabledContinue={
                !selectedGender ||
                (needsAestheticSelection && !selectedAesthetic) ||
                isPending
            }
            bgImage="/assets/backgrounds/green_bg.png"
        >
            <div className="flex flex-col gap-3 sm:gap-4 overflow-y-auto max-h-[50vh] hide-scrollbar">
                <DefaultOptions
                    options={GENDER_OPTIONS.map(opt => opt.label)}
                    value={selectedGenderLabel}
                    onChange={handleGenderChange}
                />
                
                {needsAestheticSelection && (
                    <div className="mt-6">
                        <p className="mb-2 text-[#F0EDEB] font-medium">
                            What is your fashion aesthetic preference?
                        </p>
                        <DefaultOptions
                            options={filteredAestheticOptions.map(opt => opt.label)}
                            value={selectedAestheticLabel}
                            onChange={handleAestheticChange}
                        />
                    </div>
                )}
            </div>
        </QuizStepLayout>
    );
};

export default GenderIdentityStep;
