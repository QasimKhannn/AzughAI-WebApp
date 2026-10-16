import { motion } from "framer-motion";


const StepInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="w-full"
    >
        <input
            {...props}
            id="name-input"
            type="text"
            className="w-full px-4 py-3 rounded-2xl border border-white bg-transparent backdrop-blur-sm focus:outline-none focus:ring-1 !focus:ring-[#DED8D4] !text-white font-light !placeholder-[#F0EDEB80] selection:bg-white selection:text-black caret-white tracking-[0.02em] font-manrope"
        />
    </motion.div>
);

export default StepInput;