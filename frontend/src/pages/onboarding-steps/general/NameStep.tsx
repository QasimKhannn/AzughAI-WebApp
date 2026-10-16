// import { Button } from "@/components/ui/button";
// import { ArrowRight } from "lucide-react";
// import React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { useRoutesContext } from "@/context/RoutesContext";
// import OnboardingLayout from "@/features/onboarding/components/OnboardingLayout";


// const StepInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
//     <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4, delay: 0.3 }}
//         className="w-full"
//     >
//         <input
//             {...props}
//             id="name-input"
//             type="text"
//             className="w-full px-4 py-3 rounded-2xl border border-white bg-transparent backdrop-blur-sm focus:outline-none focus:ring-1 !focus:ring-[#DED8D4] !text-white font-light !placeholder-[#F0EDEB80] selection:bg-white selection:text-black caret-white tracking-[0.02em] font-manrope"
//         />
//     </motion.div>
// );

// const NameStep: React.FC = () => {
//     const [name, setName] = React.useState("");
//     const [showGreet, setShowGreet] = React.useState(false);
//     const typingTimeout = React.useRef<NodeJS.Timeout | null>(null);
//     const { goToNext } = useRoutesContext();

//     // Show greeting after user stops typing for 1s and input is not empty
//     React.useEffect(() => {
//         if (typingTimeout.current) clearTimeout(typingTimeout.current);
//         if (!name) {
//             setShowGreet(false);
//             return;
//         }
//         typingTimeout.current = setTimeout(() => {
//             setShowGreet(true);
//         }, 1000);
//         return () => {
//             if (typingTimeout.current) clearTimeout(typingTimeout.current);
//         };
//     }, [name]);

//     const handleContinue = () => {
//         if (name.trim()) {
//             localStorage.setItem("userName", name.trim());
//             goToNext();
//         }
//     };

//     return (
//         <OnboardingLayout
//         hideTopBackButton={false}
//          className="flex flex-col items-center min-h-[80dvh] h-[80dvh] max-h-[100dvh] text-white z-10 pt-8 sm:pt-16 pb-8 sm:pb-12 px-3 sm:px-6">
//             <div className="flex-1 flex flex-col justify-between w-full max-w-lg mx-auto">
//                 <p className="text-[#F0EDEB] sm:text-lg w-[65%] sm:w-[60%] self-end text-right mt-12 mr-0 sm:mr-2 px-1 sm:px-0">
//                     How should I address you? Drop a name, a nickname, or whatever feels most you.
//                 </p>
//                 <div className="flex flex-col items-center justify-center w-full px-2" style={{ maxWidth: 340 }}>
//                     <StepInput
//                         type="text"
//                         value={name}
//                         onChange={e => setName(e.target.value)}
//                         placeholder="Call me Zara"
//                         onKeyDown={e => {
//                             if (e.key === "Enter" && name) {
//                                 handleContinue();
//                             }
//                         }}
//                         autoFocus
//                         inputMode="text"
//                         maxLength={32}
//                     />
//                     <AnimatePresence>
//                         {showGreet && (
//                             <motion.p
//                                 className="mt-3 text-center text-white text-base"
//                                 initial={{ opacity: 0, y: 10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: 10 }}
//                                 transition={{ duration: 0.3 }}
//                             >
//                                 Nice to meet you, {name} ♡
//                             </motion.p>
//                         )}
//                     </AnimatePresence>
//                 </div>
//                 <motion.div
//                     className="self-end mt-8 sm:mt-0"
//                     initial={false}
//                     animate={name ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0.5 }}
//                     transition={{ duration: 0.3 }}
//                 >
//                     <Button
//                         className="w-24 h-12 mb-28 rounded-full bg-[#DED8D4CC] flex items-center justify-center"
//                         style={{ minWidth: "96px" }}
//                         disabled={!name}
//                         onClick={handleContinue}
//                     >
//                         <ArrowRight className="text-black" style={{ height: "24px", width: "24px" }} />
//                     </Button>
//                 </motion.div>
//             </div>
//         </OnboardingLayout>
//     );
// };

// export default NameStep;
