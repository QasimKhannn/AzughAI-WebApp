import React from "react";
import { motion } from "framer-motion";
import OnboardingLayout from "@/layout/OnboardingLayout";
import { useRoutesContext } from "@/context/RoutesContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const SummaryStep: React.FC = () => {
    const { goToNext, goToPrev } = useRoutesContext();
    const [isLoading, setIsLoading] = React.useState(false);

    // Get stored data from localStorage
    const getUserData = () => {
        const data = {
            name: localStorage.getItem("userName") || "there",
            genderIdentity: localStorage.getItem("genderIdentity"),
            stylingVoice: localStorage.getItem("stylingVoice"),
            ageGroup: localStorage.getItem("ageGroup"),
            culturalRegions: localStorage.getItem("culturalRegions"),
            skinTone: localStorage.getItem("skinTone"),
            hairType: localStorage.getItem("hairType"),
            hairColor: localStorage.getItem("hairColor"),
            jewelryTones: localStorage.getItem("jewelryTones"),
            likedAesthetics: JSON.parse(localStorage.getItem("likedAesthetics") || "[]"),
            likedMoods: JSON.parse(localStorage.getItem("likedMoods") || "[]"),
            likedColors: JSON.parse(localStorage.getItem("likedColors") || "[]"),
            bodyShape: localStorage.getItem("bodyShape"),
            sizes: JSON.parse(localStorage.getItem("sizes") || "{}"),
            budgetRange: localStorage.getItem("budgetRange"),
            brandPreference: localStorage.getItem("brandPreference"),
            likedFabrics: JSON.parse(localStorage.getItem("likedFabrics") || "[]"),
            location: localStorage.getItem("location"),
            lifestyle: localStorage.getItem("lifestyle"),
            wardrobeStrategy: localStorage.getItem("wardrobeStrategy"),
        };
        return data;
    };

    const userData = getUserData();

    const handleFinish = async () => {
        setIsLoading(true);

        // Simulate API call to save user profile
        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay

            // Mark onboarding as complete
            localStorage.setItem("onboardingComplete", "true");

            // Navigate to home or dashboard
            goToNext();
        } catch (error) {
            console.error("Error completing onboarding:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getSummaryItems = () => {
        const items = [];

        if (userData.genderIdentity) items.push({ label: "Identity", value: userData.genderIdentity });
        if (userData.stylingVoice) items.push({ label: "Style Voice", value: userData.stylingVoice });
        if (userData.ageGroup) items.push({ label: "Age Group", value: userData.ageGroup });
        if (userData.skinTone) items.push({ label: "Skin Tone", value: userData.skinTone });
        if (userData.hairType) items.push({ label: "Hair Type", value: userData.hairType });
        if (userData.likedAesthetics.length > 0) items.push({ label: "Aesthetics", value: userData.likedAesthetics.slice(0, 3).join(", ") });
        if (userData.bodyShape) items.push({ label: "Body Shape", value: userData.bodyShape });
        if (userData.budgetRange) items.push({ label: "Budget", value: userData.budgetRange });
        if (userData.location) items.push({ label: "Location", value: userData.location });
        if (userData.lifestyle) items.push({ label: "Lifestyle", value: userData.lifestyle });

        return items;
    };

    const summaryItems = getSummaryItems();

    return (
        <OnboardingLayout bgImage="/assets/summary-bg.png">
            <div className="flex flex-col w-full h-[85vh] items-center justify-center font-manrope">
                <div className="flex-1 flex flex-col justify-center items-center w-full max-w-md mx-auto px-4">
                    <p className="text-white text-center text-2xl sm:text-3xl font-semibold mb-12 mt-8">
                        Done and done. You've just created your Azugh style blueprint—full of vibe, voice, and personal story. Let's build your closet around you now.
                    </p>
                </div>
                <div className="w-full fixed bottom-0 px-4 mb-4">
                    <motion.button
                        type="button"
                        className={`flex-1 py-3 w-full rounded-full bg-[#DED8D4CC] text-[#292929] font-semibold transition `}
                        onClick={goToNext}
                    >
                        I'm Ready
                    </motion.button>
                </div>
            </div>
        </OnboardingLayout>
    );
};

export default SummaryStep;
