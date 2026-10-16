import React from "react";

interface PageLayoutProps {
    children: React.ReactNode;
    bgImage?: string;
    bgVideo?: string; // Add this prop
    className?: string;
}

const PageLayout = (props: PageLayoutProps) => {
    return (
        <div className="h-[100vh] px-safe pt-safe pb-safe flex items-center justify-center relative overflow-hidden">
            {/* Render video background if bgVideo is provided */}
            {props.bgVideo && (
                <video
                    className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover z-0"
                    src={props.bgVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            )}
            {/* Fallback to image background if bgImage is provided */}
            {!props.bgVideo && props.bgImage && (
                <img
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    src={props.bgImage}
                    alt="Background"
                />
            )}
            <div className={`flex flex-col justify-center items-center h-full w-full relative z-10 ${props.className ?? ""}`}>
                {props.children}
            </div>
        </div>
    )
}

export default PageLayout;