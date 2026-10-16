import React from "react";

const BudgetSlider: React.FC<{
  options: string[];
  selected: number | null;
  onChange: (index: number) => void;
}> = ({ options, selected, onChange }) => {
  const sliderBg = "#AA9C64";
  const dotColor = "#DED8D4";
  const dotCount = options.length;
  const dotSize = 10;

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Selected range text */}
      {selected !== null && (
        <p className="text-[#EFECEAE0] text-[44px] font-manrope font-[400]">
          {options[selected]}
        </p>
      )}

      {/* Slider */}
      <div className="relative w-full" style={{ height: 36 }}>
        {/* Track */}
        <div
          className="absolute h-4 left-0 right-0 top-1/2 -translate-y-1/2 rounded-full"
          style={{ background: sliderBg }}
        />

        {/* Dots */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 w-full h-4 pointer-events-none z-10 flex items-center">
          {options.map((_, idx) => {
            if (idx === selected) return <span key={idx} style={{ width: 0 }} />;
            // All dots same size, and moved further inside the track
            const size = dotSize;
            // For first and last dot, offset more to move further inside the track
            let leftPercent = (idx / (dotCount - 1)) * 100;
            const insideOffsetPercent = 2.5; // Increase this value to move dots further inside (in percent)
            if (idx === 0)
              leftPercent = insideOffsetPercent;
            else if (idx === dotCount - 1)
              leftPercent = 100 - insideOffsetPercent;
            return (
              <span
                key={idx}
                className="rounded-full absolute"
                style={{
                  width: size,
                  height: size,
                  background: dotColor,
                  left: `calc(${leftPercent}% - ${size / 2}px)`,
                  top: `calc(50% - ${size / 2}px)`,
                  boxSizing: "border-box",
                }}
              />
            );
          })}
        </div>

        {/* Range input */}
        <input
          type="range"
          min={0}
          max={options.length - 1}
          value={selected ?? 0}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-6 bg-transparent appearance-none absolute left-0 right-0 top-1/2 -translate-y-1/2 custom-range-thumb"
        />
      </div>

      <style>{`
        input[type="range"].custom-range-thumb {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          background: transparent;
        }
        input[type="range"].custom-range-thumb:focus {
          outline: none;
        }
        input[type="range"].custom-range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #DED8D4;
          /* centers thumb on 6-px track */
          margin-bottom: -8px;
          margin-bottom: 0;
          /* equal shadow on all sides: white glow + black shadow */
          box-shadow: 0 0 8px 2px rgba(0,0,0,.2), 0 0 12px 2px rgba(0,0,0,0.25);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default BudgetSlider;
