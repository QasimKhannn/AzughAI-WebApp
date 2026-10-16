import React from "react";

interface QuizProgressBarProps {
    progress?: { current: number; total: number };
    questionLabel?: string;
    className?: string;
}

const QuizProgressBar: React.FC<QuizProgressBarProps> = ({
    progress,
    questionLabel,
    className = "",
}) => {
    if (!progress && !questionLabel) return null;
    
    return (
        <div className={`w-full h-auto flex flex-col px-6 ${className}`}>
            {progress && (
                <>
                    <span className="text-lg mb-2 self-start text-[#F0EDEB] font-light tracking-widest w-full max-w-[100%]">
                        {String(progress.current).padStart(2, "0")}/{String(progress.total).padStart(2, "0")}
                    </span>
                    <div className="w-full max-w-[100%] h-[2px] bg-white/20 rounded-full mb-2">
                        <div
                            className="h-[2px] bg-[#F0EDEB] rounded-full transition-all"
                            style={{ width: `${(progress.current / progress.total) * 100}%` }}
                        />
                    </div>
                </>
            )}
            {questionLabel && (
                <h2 className="text-[#F0EDEB] text-2xl my-3 font-[600] text-center w-full font-manrope">{questionLabel}</h2>
            )}
        </div>
    );
};

export default QuizProgressBar;
