import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  User, 
  MapPin, 
  Activity, 
  Palette, 
  Shirt,
  DollarSign,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import MotionText from "@/components/animations/MotionText";
import KeyWords from "./KeyWords";
import type { OnboardingKeywords } from "@/features/aesthetics/types";

const mockSummary = {
  narrative: "You move through life with an effortless confidence, drawn to pieces that speak softly but carry weight. Your style is a reflection of who you are—grounded, intentional, and authentic.\n\nWhether you're exploring hidden coffee shops in the city or wandering through art galleries on a quiet Sunday, you choose comfort without compromising elegance. Clean lines and relaxed silhouettes follow you everywhere, creating a signature look that feels uniquely yours.\n\nYou believe style is personal, not prescribed. Muted earth tones ground your wardrobe, while street-inspired pieces add an edge that feels fresh and modern. It's not about trends—it's about creating a visual language that tells your story.",
};

const mockKeywords: OnboardingKeywords = {
  city: "London",
  gender: "female",
  age_group: "20s",
  lifestyle_1: "creative",
  lifestyle_2: "social",
  style_1: "minimalist",
  style_2: "streetwear",
  fit_1: "relaxed",
  fit_2: "tailored",
  budget: "mid-range",
};

interface SummaryPopupProps {
  open: boolean;
  onClose: () => void;
  onGoBackToChat?: () => void;
  summary?: string;
  keywords?: OnboardingKeywords;
}

const SummaryPopup = ({ 
  open, 
  onClose, 
  onGoBackToChat,
  summary,
  keywords
}: SummaryPopupProps) => {
  // Use provided data or fall back to mock
  const displaySummary = summary || mockSummary.narrative;
  const displayKeywords = keywords || mockKeywords;

  // Filter out "unknown" keywords and create display items
  const keywordItems = [
    { icon: MapPin, label: displayKeywords.city, key: 'city' },
    { icon: User, label: displayKeywords.gender, key: 'gender' },
    { icon: Calendar, label: displayKeywords.age_group, key: 'age_group' },
    { icon: Activity, label: displayKeywords.lifestyle_1, key: 'lifestyle_1' },
    { icon: Activity, label: displayKeywords.lifestyle_2, key: 'lifestyle_2' },
    { icon: Palette, label: displayKeywords.style_1, key: 'style_1' },
    { icon: Palette, label: displayKeywords.style_2, key: 'style_2' },
    { icon: Shirt, label: displayKeywords.fit_1, key: 'fit_1' },
    { icon: Shirt, label: displayKeywords.fit_2, key: 'fit_2' },
    { icon: DollarSign, label: displayKeywords.budget, key: 'budget' },
  ].filter(item => item.label && item.label !== 'unknown');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-screen xl:max-w-4xl h-screen xl:h-[85vh] bg-gradient-to-br from-[#FDFCFA] to-[#F9F7F4] rounded-none xl:rounded-3xl shadow-2xl border-0 p-0 gap-0 outline-none flex flex-col overflow-hidden">
        {/* Header */}
        <DialogHeader className="relative px-4 xl:px-8 pb-4 pt-10 xl:pt-8 flex-shrink-0">
          <DialogTitle className="font-light text-foreground/90 text-2xl xl:text-4xl text-center tracking-tight">
            your style profile
          </DialogTitle>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#AA9C64] to-transparent mx-auto mt-4"
          />
        </DialogHeader>

        {/* Scrollable Narrative */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 xl:px-16 scrollbar-thin scrollbar-thumb-[#AA9C64]/20 scrollbar-track-transparent">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-2xl mx-auto py-4"
          >
            <div className="text-base xl:text-[17px] text-[#2a2a2a] leading-[1.8] xl:leading-[1.9] font-light text-left whitespace-pre-line">
              <MotionText text={displaySummary} speed={15} />
            </div>
          </motion.div>
        </div>

        {/* Tags Section */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center px-4 xl:px-16 py-4 xl:py-6">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#E8E4DD] to-transparent mb-4"
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex items-center justify-center gap-2 xl:gap-4 flex-wrap"
          >
            {keywordItems.map((item) => (
              <KeyWords key={item.key} icon={item.icon} label={item.label} />
            ))}
          </motion.div>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex-shrink-0 flex flex-col-reverse xl:flex-row items-center justify-center gap-3 xl:gap-4 px-4 xl:px-16 pb-8 pt-4"
        >
          <Button
            variant="secondary"
            onClick={onGoBackToChat}
            size="lg"
            className="lowercase rounded-full font-light text-sm xl:text-base w-2/3 xl:w-auto"
          >
            review again
          </Button>
          <Button
            variant="default"
            onClick={onClose}
            size="lg"
            className="lowercase rounded-full font-light text-sm xl:text-base w-2/3 xl:w-auto"
          >
            let's explore
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default SummaryPopup;