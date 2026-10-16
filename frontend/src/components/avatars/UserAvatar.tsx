import { cn } from '@/lib/utils';

interface UserAvatarProps {
  initials?: string;
  name?: string;
  className?: string;
}
export const UserAvatar: React.FC<UserAvatarProps> = ({
  initials = "U",
  name = "User",
  className = "",
}) => {
  return (
    <div
      className={cn("w-8 h-8 rounded-full text-gray-600 bg-chat-assistant flex items-center justify-center shadow ml-2", className)}
      title={name}
    >
      {initials}
    </div>
  );
};
