import {cn } from '@/lib/utils';

interface AssistantAvatarProps {
  className?: string;
}

export const AssistantAvatar = ({ className }: AssistantAvatarProps) => (
  <div className={cn("w-8 h-8 rounded-full bg-white flex items-center justify-center shadow mr-2", className)}>
    <img src="/assets/logo-black.svg" alt="Assistant" className="w-6 h-6" />
  </div>
);
