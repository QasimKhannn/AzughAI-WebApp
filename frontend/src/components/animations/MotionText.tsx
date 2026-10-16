import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface MotionTextProps {
    text: string;
    className?: string;
    speed?: number; // ms per character
}

const animatedMessages = new Set<string>();

const MotionText: React.FC<MotionTextProps> = ({ text, className, speed = 25 }) => {
    const [displayedCount, setDisplayedCount] = useState(
        animatedMessages.has(text) ? text.length : 0
    );
    const [hasAnimated, setHasAnimated] = useState(animatedMessages.has(text));
    const prevTextRef = useRef(text);

    useEffect(() => {
        if (prevTextRef.current !== text) {
            setDisplayedCount(animatedMessages.has(text) ? text.length : 0);
            setHasAnimated(animatedMessages.has(text));
            prevTextRef.current = text;
        }

        if (!hasAnimated) {
            let start = Date.now();
            let raf: number;

            const update = () => {
                const elapsed = Date.now() - start;
                const count = Math.min(text.length, Math.floor(elapsed / speed));
                setDisplayedCount(count);
                if (count < text.length) {
                    raf = requestAnimationFrame(update);
                } else {
                    setHasAnimated(true);
                    animatedMessages.add(text);
                }
            };

            raf = requestAnimationFrame(update);

            return () => cancelAnimationFrame(raf);
        }
    }, [text, speed, hasAnimated]);

    return (
        <span className={className} style={{ whiteSpace: "pre-line" }}>
            {text
                .slice(0, displayedCount)
                .split("")
                .map((char, i) => (
                    <motion.span
                        key={i}
                        initial={{ opacity: 0, filter: "blur(8px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.22 }}
                        style={{ display: "inline" }}
                    >
                        {char}
                    </motion.span>
                ))}
        </span>
    );
};

export default MotionText;