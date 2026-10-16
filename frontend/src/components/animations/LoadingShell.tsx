import React from "react";
import { motion } from "framer-motion";

const DEFAULT_FILL_COLOR = "#AA9C64";
const DEFAULT_BG_COLOR = "#F5F5F5";
const DEFAULT_STROKE_COLOR = "#7A6F43";

const LoadingShell = ({
  height = 278,
  progress = 0, // 0 to 100
  fillColor = DEFAULT_FILL_COLOR,
  bgColor = DEFAULT_BG_COLOR,
  strokeColor = DEFAULT_STROKE_COLOR,
  duration = 2,
}: {
  height?: number;
  progress?: number;
  fillColor?: string;
  bgColor?: string;
  strokeColor?: string;
  duration?: number;
}) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));

  // Define the viewBox dimensions
  const viewBoxWidth = 380;
  const viewBoxHeight = 278;

  // Calculate aspect ratio and width
  const aspectRatio = viewBoxWidth / viewBoxHeight;
  const width = height * aspectRatio;

  // Actual mask bounds from the path (measured from the SVG)
  // The mask path starts at y=40 and ends at y=237
  const maskTop = 0;
  const maskBottom = 237;
  const maskHeight = maskBottom - maskTop;

  // Calculate fill position based on progress
  // At 0%: fill starts at maskBottom (empty)
  // At 100%: fill starts at maskTop (full)
  const fillStartY = maskBottom - (maskHeight * clampedProgress) / 100;
  const fillHeight = maskBottom - fillStartY;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", margin: "0 auto" }}
    >
      <defs>
        {/* Main mask shape */}
        <mask
          id="loading-shell-mask"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="29"
          y="40"
          width="323"
          height="197"
        >
          <path
            d="M115.909 209.694C72.1584 152.671 33.1007 141.743 29.1938 133.139C27.6309 128.451 35.254 108.089 61.8168 97.9322C89.9429 90.1194 101.662 83.0879 112.6 76.0564C126.663 67.4623 160.258 51.0554 177.446 45.5864C185.884 42.9018 204.791 39.3022 214.166 40.1175C232.136 41.6801 239.167 42.8781 248.543 45.5864C283.701 55.7431 297.167 77.6576 302.636 90.1581C307.324 97.1896 309.667 95.627 316.699 97.9709C328.418 101.096 322.949 118.284 339.356 121.409C357.326 122.191 354.2 143.285 340.137 146.41C339.356 164.38 326.856 158.129 319.043 169.067C304.98 195.631 272.448 208.658 256.54 215.944C240.328 223.37 212.008 233.132 197.162 235.476L196.72 235.532C177.959 237.884 149.242 241.486 115.909 209.694Z"
            fill="#D9D9D9"
          />
        </mask>

        {/* Clip path for progressive fill */}
        {/* <clipPath id="fill-clip">
                    <motion.rect
                        x="0"
                        y={fillStartY}
                        width={viewBoxWidth}
                        height={fillHeight}
                        animate={{ 
                            y: fillStartY,
                            height: fillHeight
                        }}
                        transition={{ 
                            duration: duration,
                            ease: "easeInOut"
                        }}
                    />
                </clipPath> */}
        <clipPath id="fill-clip">
          <motion.path
            d={`
                            M 0,${fillStartY + 20}
                            Q ${viewBoxWidth * 0.25},${fillStartY} ${
              viewBoxWidth * 0.5
            },${fillStartY + 20}
                            T ${viewBoxWidth},${fillStartY + 20}
                            L ${viewBoxWidth},${viewBoxHeight}
                            L 0,${viewBoxHeight}
                            Z
                        `}
            animate={{
              d: `
                                M 0,${fillStartY + 20}
                                Q ${viewBoxWidth * 0.25},${fillStartY} ${
                viewBoxWidth * 0.5
              },${fillStartY + 20}
                                T ${viewBoxWidth},${fillStartY + 20}
                                L ${viewBoxWidth},${viewBoxHeight}
                                L 0,${viewBoxHeight}
                                Z
                            `,
            }}
            transition={{
              duration: duration,
              ease: "easeInOut",
            }}
          />
        </clipPath>
      </defs>

      <g mask="url(#loading-shell-mask)">
        {/* Background */}
        <rect
          x="0"
          y="0"
          width={viewBoxWidth}
          height={viewBoxHeight}
          fill={bgColor}
        />

        {/* Progressive fill */}
        <g clipPath="url(#fill-clip)">
          <rect
            x="0"
            y="0"
            width={viewBoxWidth}
            height={viewBoxHeight}
            fill={fillColor}
            style={{
              filter: "drop-shadow(0px 1px 22px rgba(74, 72, 49, 0.15))",
            }}
          />
        </g>
      </g>

      {/* Outline stroke */}
      <path
        d="M115.909 209.694C72.1584 152.671 33.1007 141.743 29.1938 133.139C27.6309 128.451 35.254 108.089 61.8168 97.9322C89.9429 90.1194 101.662 83.0879 112.6 76.0564C126.663 67.4623 160.258 51.0554 177.446 45.5864C185.884 42.9018 204.791 39.3022 214.166 40.1175C232.136 41.6801 239.167 42.8781 248.543 45.5864C283.701 55.7431 297.167 77.6576 302.636 90.1581C307.324 97.1896 309.667 95.627 316.699 97.9709C328.418 101.096 322.949 118.284 339.356 121.409C357.326 122.191 354.2 143.285 340.137 146.41C339.356 164.38 326.856 158.129 319.043 169.067C304.98 195.631 272.448 208.658 256.54 215.944C240.328 223.37 212.008 233.132 197.162 235.476L196.72 235.532C177.959 237.884 149.242 241.486 115.909 209.694Z"
        stroke={strokeColor}
        strokeWidth="2"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
};

export default LoadingShell;
