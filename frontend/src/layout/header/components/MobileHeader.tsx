import { useEffect, useState } from "react";
import type { NavItem as NavItemType } from "../types";
import NavItem from "./NavItem";
import Logo, { LogoType } from "@/components/logos/Logo";
import { useNavigate, Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import { Button } from "@/components/ui/button";
import { SquarePen, Search } from "lucide-react";
import ConversationsModal from "./conversations/ConversationsModal";
import { getUserInitials } from "@/features/auth/utils/UserInitials";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { UserAvatar } from "@/components/avatars";
import MobileNavModal from "./MobileNavModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MobileHeaderProps {
  isOpen: boolean;
  navigationItems: NavItemType[];
  onClose: () => void;
  useWhiteBackground?: boolean;
  isChatOnboarding?: boolean;
}

export default function MobileHeader({
  isOpen,
  navigationItems,
  onClose,
  useWhiteBackground = false,
  isChatOnboarding = false,
}: MobileHeaderProps) {
  const navigate = useNavigate();
  const [conversationsOpen, setConversationsOpen] = useState(false);
  const [navModalOpen, setNavModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const navModalItems = navigationItems.map((item) => ({
    ...item,
    onClick: () => {
      item.onClick();
      setNavModalOpen(false);
    },
  }));
  const handleMobileLogout = async () => {
    await logout();
    setNavModalOpen(false);
        navigate("/auth/login");
    toast.success("Logged out successfully");
  };
  return (
    <header
      className={cn(
        "h-[12vh] flex items-center justify-between flex-shrink-0 px-6 md:hidden",
        useWhiteBackground
          ? "bg-white border-b border-foreground"
          : "bg-transparent"
      )}
    >
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
        <Link to="/">
          <Logo
            className="h-12"
            type={useWhiteBackground ? LogoType.DEFAULT : LogoType.WHITE}
          ></Logo>
        </Link>
        <Button
          variant={useWhiteBackground ? "outline-dark" : "outline"}
          size="lg"
          className="px-4"
          onClick={() => navigate("/chat")}
          disabled={isChatOnboarding}
        >
          <SquarePen strokeWidth={1.5} />
          <span className="font-light text-sm">new chat</span>
        </Button>
      </div>
      <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
        <Button
          variant={useWhiteBackground ? "outline-dark" : "outline"}
          size="lg"
          className="px-4"
          onClick={() => setConversationsOpen(true)}
          disabled={isChatOnboarding}
        >
          <Search strokeWidth={1.5} />
          <span className="font-light text-sm">past chats</span>
        </Button>
        <button
          className="focus:outline-none cursor-pointer"
          onClick={() => setNavModalOpen(true)}
        >
          <UserAvatar
            initials={getUserInitials(user.first_name, user.last_name)}
            name={`${user.first_name} ${user.last_name}`}
            className="h-10 w-10 ml-0"
          />
        </button>
      </div>

      <ConversationsModal
        open={conversationsOpen}
        onOpenChange={setConversationsOpen}
      />
      <MobileNavModal
        open={navModalOpen}
        conversationItems={navModalItems}
        onLogout={handleMobileLogout}
        onClose={() => setNavModalOpen(false)}
      />
    </header>
  );
}
