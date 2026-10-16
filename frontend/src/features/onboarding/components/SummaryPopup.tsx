import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { User, MapPin, Droplet, Quote } from "lucide-react";
import { motion } from "framer-motion";
import MotionText from "@/components/animations/MotionText";

const mockSummary = {
  narrative: {
    intro: "You move through life with an effortless confidence, drawn to pieces that speak softly but carry weight. Your style is a reflection of who you are—grounded, intentional, and authentic.",
    lifestyle: "Whether you're exploring hidden coffee shops in the city or wandering through art galleries on a quiet Sunday, you choose comfort without compromising elegance. Clean lines and relaxed silhouettes follow you everywhere, creating a signature look that feels uniquely yours.",
    philosophy: "You believe style is personal, not prescribed. Muted earth tones ground your wardrobe, while street-inspired pieces add an edge that feels fresh and modern. It's not about trends—it's about creating a visual language that tells your story.",
  },
  city: "London",
  gender: "Female",
  skin: "Warm olive",
};

const SummaryPopup = ({
  open,
  onClose,
  onGoBackToChat,
}: {
  open: boolean;
  onClose: () => void;
  onGoBackToChat?: () => void;
}) => {
  // Combine all narrative text into one sequence
  const fullNarrative = `${mockSummary.narrative.intro}\n\n${mockSummary.narrative.lifestyle}\n\n${mockSummary.narrative.philosophy}`;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[85vh] focus:outline-none bg-gradient-to-br from-[#FDFCFA] to-[#F9F7F4] rounded-3xl shadow-2xl border-none flex flex-col p-0 overflow-hidden">
        
        {/* TOP CONTAINER - Header (15% height) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-shrink-0 h-[15%] flex flex-col items-center justify-center px-16 pt-8 pb-4"
        >
          <h2 className="text-4xl font-light text-[#1a1a1a] mb-2 tracking-tight">
            your style profile
          </h2>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#AA9C64] to-transparent mt-4" />
        </motion.div>

        {/* MIDDLE CONTAINER 1 - Scrollable Narrative (55% height) */}
        <div className="flex-1 h-[55%] overflow-y-auto overflow-x-hidden px-16 scrollbar-thin scrollbar-thumb-[#AA9C64]/20 scrollbar-track-transparent">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-2xl mx-auto"
          >
            {/* Single Sequential Narrative */}
            <div className="text-[17px] text-[#2a2a2a] leading-[1.9] font-light text-left whitespace-pre-line">
              <MotionText text={fullNarrative} speed={15} />
            </div>
          </motion.div>
        </div>

        {/* MIDDLE CONTAINER 2 - Fixed Tags Section (15% height) */}
        <div className="flex-shrink-0 h-[15%] flex flex-col items-center justify-center px-16 overflow-hidden">
          {/* Decorative Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#E8E4DD] to-transparent mb-4"
          />

          {/* Contextual Tags */}
            <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex items-center justify-center gap-4 flex-wrap"
            >
            <div className="group inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md text-[#2a2a2a] text-sm font-medium border border-[#AA9C64]/20 shadow-sm hover:shadow-md hover:border-[#AA9C64]/40 transition-all duration-300">
              <div className="p-1 rounded-full bg-[#AA9C64]/10 group-hover:bg-[#AA9C64]/20 transition-colors duration-300">
              <Quote className="w-3.5 h-3.5 text-[#AA9C64]" />
              </div>
              <span className="lowercase font-light">top size</span>
            </div>
            <div className="group inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md text-[#2a2a2a] text-sm font-medium border border-[#AA9C64]/20 shadow-sm hover:shadow-md hover:border-[#AA9C64]/40 transition-all duration-300">
              <div className="p-1 rounded-full bg-[#AA9C64]/10 group-hover:bg-[#AA9C64]/20 transition-colors duration-300">
              <Quote className="w-3.5 h-3.5 text-[#AA9C64]" />
              </div>
              <span className="lowercase font-light">bottom size</span>
            </div>
            <div className="group inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md text-[#2a2a2a] text-sm font-medium border border-[#AA9C64]/20 shadow-sm hover:shadow-md hover:border-[#AA9C64]/40 transition-all duration-300">
              <div className="p-1 rounded-full bg-[#AA9C64]/10 group-hover:bg-[#AA9C64]/20 transition-colors duration-300">
              <MapPin className="w-3.5 h-3.5 text-[#AA9C64]" />
              </div>
              <span className="lowercase font-light">{mockSummary.city}</span>
            </div>
            <div className="group inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md text-[#2a2a2a] text-sm font-medium border border-[#AA9C64]/20 shadow-sm hover:shadow-md hover:border-[#AA9C64]/40 transition-all duration-300">
              <div className="p-1 rounded-full bg-[#AA9C64]/10 group-hover:bg-[#AA9C64]/20 transition-colors duration-300">
              <User className="w-3.5 h-3.5 text-[#AA9C64]" />
              </div>
              <span className="lowercase font-light">{mockSummary.gender}</span>
            </div>
            <div className="group inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md text-[#2a2a2a] text-sm font-medium border border-[#AA9C64]/20 shadow-sm hover:shadow-md hover:border-[#AA9C64]/40 transition-all duration-300">
              <div className="p-1 rounded-full bg-[#AA9C64]/10 group-hover:bg-[#AA9C64]/20 transition-colors duration-300">
              <Droplet className="w-3.5 h-3.5 text-[#AA9C64]" />
              </div>
              <span className="lowercase font-light">{mockSummary.skin}</span>
            </div>
            </motion.div>
        </div>

        {/* BOTTOM CONTAINER - CTA Buttons (15% height) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex-shrink-0 h-[15%] flex items-center justify-center gap-4 px-16 pb-8"
        >
          {/* Go Back to Chat Button */}
          <button
            className="group relative px-8 py-4 lowercase rounded-full bg-chat-assistant backdrop-blur-md text-gray-800 font-light text-base tracking-wide shadow hover:bg-chat-assistant transition-all duration-300 overflow-hidden focus:outline-none focus:ring-0 border border-[#AA9C64]/20 hover:border-[#AA9C64]/40"
            onClick={onGoBackToChat}
          >
            <span className="relative z-10">review again</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#AA9C64]/10 to-[#C4B583]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          {/* Ready to Explore Button */}
          <button
            className="group relative px-10 py-4 lowercase rounded-full bg-[#303A2FB2] text-white font-light text-base tracking-wide shadow hover:bg-chat-assistant transition-all duration-300 overflow-hidden focus:outline-none focus:ring-0"
            onClick={onClose}
          >
            <span className="relative z-10">let's explore</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#C4B583] to-[#AA9C64] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </motion.div>

        {/* Enhanced decorative elements */}
        <div className="absolute top-8 right-8 w-32 h-32 bg-[#AA9C64]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-8 left-8 w-40 h-40 bg-[#E8E4DD]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-24 h-24 bg-[#C4B583]/5 rounded-full blur-2xl pointer-events-none" />
      </DialogContent>
    </Dialog>
  );
};

export default SummaryPopup;