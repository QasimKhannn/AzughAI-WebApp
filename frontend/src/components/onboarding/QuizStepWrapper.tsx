// import React from "react";
// import { ArrowLeft } from "lucide-react";
// import { motion } from "framer-motion";
// import QuizProgressBar from "./QuizProgressBar";

// interface QuizStepWrapperProps {
//     progress?: { current: number; total: number };
//     questionLabel?: string;
//     showBack?: boolean;
//     onBack?: () => void;
//     onContinue?: () => void;
//     continueLabel?: string;
//     disabledContinue?: boolean;
//     children: React.ReactNode;
// }

// const QuizStepWrapper: React.FC<QuizStepWrapperProps> = ({
//     progress,
//     questionLabel,
//     showBack = true,
//     onBack,
//     onContinue,
//     continueLabel = "Continue",
//     disabledContinue,
//     children,
// }) => (
//     <div
//         className="flex flex-col h-full min-h-[100dvh] justify-between w-full max-w-md mx-auto bg-transparent font-manrope"
//         style={{ minHeight: "100dvh", height: "100dvh" }}
//     >
//         <QuizProgressBar progress={progress} questionLabel={questionLabel} />
//         <div
//             className="flex-1 min-h-0 flex flex-col justify-start gap-[3vw] sm:gap-4 py-[4vw] sm:py-4 px-[4vw] sm:px-4 overflow-y-auto"
//             style={{
//                 flexGrow: 1,
//                 flexShrink: 1,
//                 minHeight: 0,
//                 maxHeight: "calc(100dvh - 220px)", // adjust based on header/footer
//             }}
//         >
//             {children}
//         </div>
//         <div
//             className="w-full px-[4vw] sm:px-4 pb-[8vw] sm:pb-4 pt-[4vw] sm:pt-2"
//             style={{
//                 paddingBottom: `max(8vw, env(safe-area-inset-bottom, 32px))`,
//                 width: "100%",
//             }}
//         >
//             <div className="flex w-full space-x-[4vw] sm:space-x-4 mb-28">
//                 {showBack && (
//                     <motion.button
//                         type="button"
//                         className="flex-1 flex justify-center items-center py-3 bg-black text-[#DED8D4] font-semibold transition hover:bg-white/20 border-none rounded-full outline-none shadow-none"
//                         style={{
//                             borderRadius: "50px",
//                             border: "1.5px solid #DED8D4",
//                             boxShadow: "none",
//                         }}
//                         onClick={onBack}
//                         whileTap={{ scale: 0.96 }}
//                         whileHover={{ scale: 1.04 }}
//                         transition={{ type: "spring", stiffness: 300, damping: 20 }}
//                     >
//                         <ArrowLeft />
//                     </motion.button>
//                 )}
//                 <motion.button
//                     type="button"
//                     className={`flex-1 py-3 rounded-full bg-[#DED8D4CC] text-[#292929] font-semibold transition
//                         ${disabledContinue ? "opacity-60 cursor-not-allowed" : "opacity-100"}`}
//                     onClick={onContinue}
//                     disabled={disabledContinue}
//                     whileTap={{ scale: 0.96 }}
//                     whileHover={!disabledContinue ? { scale: 1.04 } : undefined}
//                     transition={{ type: "spring", stiffness: 300, damping: 20 }}
//                 >
//                     {continueLabel}
//                 </motion.button>
//             </div>
//         </div>
//     </div>
// );

// export default QuizStepWrapper;
