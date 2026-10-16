import React from "react";

type WidgetWrapperProps = {
    image: string;
    className?: string;
    children: React.ReactNode;
};

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({ image, className, children }) => (
    <div className={`w-full max-w-[21rem] bg-white rounded-2xl shadow-lg overflow-hidden ${className || ""}`}>
        <img src={image} alt="Widget" className="w-full h-16 object-cover" />
        <div className="flex flex-col gap-3 p-1">
            {children}
        </div>
    </div>
);

export default WidgetWrapper;
