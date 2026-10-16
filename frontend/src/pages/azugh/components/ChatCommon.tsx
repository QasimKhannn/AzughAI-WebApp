import React from "react";

export const AssistantAvatar = () => (
    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow mr-2">
        <img src="/assets/logo-black.svg" alt="Assistant" className="w-6 h-6" />
    </div>
);

interface UserAvatarProps {
  initials?: string;
  name?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ initials = "U", name = "User" }) => {
  return (
    <div 
      className="w-8 h-8 rounded-full text-gray-600 bg-chat-assistant flex items-center justify-center shadow ml-2"
      title={name}
    >
      {initials}
    </div>
  );
};

export const LoaderDots = () => (
    <div className="flex items-center space-x-1 ml-2 bg-transparent p-0 shadow-none">
        <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0ms]"></span>
        <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:150ms]"></span>
        <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:300ms]"></span>
    </div>
);

export const AssistantMessageWrapper: React.FC<{ text: string, children?: React.ReactNode }> = ({ text, children }) => (
    <div className="flex items-end px-4">
        <div className="flex flex-col justify-end">
            <AssistantAvatar />
        </div>
        <div className="flex flex-col space-y-12">
            {text && <div className="py-2 px-3 rounded-xl max-w-[80vw] sm:max-w-[60vw] bg-white text-gray-900 shadow">
                {text}
            </div>}
            {children}
        </div>
    </div>
);
