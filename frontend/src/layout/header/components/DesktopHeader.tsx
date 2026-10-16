import { useEffect, useState } from "react";
import type { NavItem as NavItemType } from "../types";
import NavItem from "./NavItem";
import Logo, { LogoType } from "@/components/logos/Logo";
import { useNavigate, Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import { Button } from "@/components/ui/button";
import { SquarePen, Search } from "lucide-react";
import ConversationsModal from "./conversations/ConversationsModal";
import { cn } from "@/lib/utils";

interface DesktopHeaderProps {
  navigationItems: NavItemType[];
  useWhiteBackground?: boolean;
  isChatOnboarding?: boolean;
}

export default function DesktopHeader({ navigationItems, useWhiteBackground = false, isChatOnboarding = false }: DesktopHeaderProps) {
  const navigate = useNavigate();
  const [conversationsOpen, setConversationsOpen] = useState(false);

  return (
    <header className={cn("h-[12vh] items-center justify-between flex-shrink-0 px-10 md:flex hidden", useWhiteBackground ? "bg-white border-b border-foreground" : "bg-transparent")}>
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
        <Link to="/">
          <Logo className="h-12" type={useWhiteBackground ? LogoType.DEFAULT : LogoType.WHITE}></Logo>
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
        <UserDropdown />
      </div>

      <ConversationsModal
        open={conversationsOpen}
        onOpenChange={setConversationsOpen}
      />
    </header>
  );
}
