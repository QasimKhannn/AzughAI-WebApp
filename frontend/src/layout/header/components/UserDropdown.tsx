import { UserAvatar } from "@/components/avatars";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { Shirt, Heart, Grid3X3, ShoppingCart, Settings, LogOut, LucideIcon, MessageSquare } from "lucide-react";
import { getUserInitials } from "@/features/auth/utils/UserInitials";
import { toast } from "sonner";

interface DropdownNavItemProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
  isActive?: boolean;
}

function DropdownNavItem({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  isActive = false,
}: DropdownNavItemProps) {
  const isDanger = variant === "danger";
  const textClass = isDanger
    ? "text-red-500 hover:text-red-600 focus:text-red-600"
    : isActive
      ? "text-foreground"
      : "text-foreground/70 hover:text-foreground";
  const bgClass = isDanger
    ? ""
    : isActive
      ? "!bg-[#e3dfd8]/80"
      : "hover:!bg-[#e3dfd8]/50";

  return (
    <DropdownMenuItem
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${bgClass} ${textClass}`}
    >
      <Icon
        size={18}
        strokeWidth={1.5}
        className={
          isDanger
            ? "text-red-400"
            : isActive
              ? "text-foreground"
              : "text-foreground/50"
        }
      />
      <span className="font-light">{label}</span>
    </DropdownMenuItem>
  );
}

interface NavItemConfig {
  icon: LucideIcon;
  label: string;
  path: string;
  variant?: "default" | "danger";
}

const mainNavItems: NavItemConfig[] = [
  { icon: MessageSquare, label: "chat", path: "/chat" },
  { icon: Shirt, label: "closet", path: "/closet" },
  { icon: Heart, label: "wish list", path: "/wishlist" },
  { icon: Grid3X3, label: "catalogue", path: "/catalogue" },
  { icon: ShoppingCart, label: "cart", path: "/cart" },
];

const settingsNavItems: NavItemConfig[] = [
  { icon: Settings, label: "account", path: "/account" },
];

export default function UserDropdown() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
    toast.success("Logged out successfully");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none cursor-pointer">
          <UserAvatar
            initials={getUserInitials(user.first_name, user.last_name)}
            name={`${user.first_name} ${user.last_name}`}
            className="h-10 w-10 ml-0"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white shadow-[0_2px_20px_rgba(0,0,0,0.15)] rounded-md border-0">
        {mainNavItems.map((item) => (
          <DropdownNavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            onClick={() => navigate(item.path)}
            isActive={location.pathname.startsWith(item.path) || (item.path === '/chat' && location.pathname === '/')}
          />
        ))}

        {/* <DropdownMenuSeparator className="bg-foreground/10" /> */}

        {settingsNavItems.map((item) => (
          <DropdownNavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            onClick={() => navigate(item.path)}
            isActive={location.pathname.startsWith(item.path)}
          />
        ))}

        {/* <DropdownMenuSeparator className="bg-foreground mt-2 mb-2" /> */}

        <DropdownNavItem
          icon={LogOut}
          label="Logout"
          onClick={handleLogout}
          variant="danger"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}