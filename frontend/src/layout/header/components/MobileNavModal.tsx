import { useEffect, useState } from "react";
import type { NavItem as NavItemType } from "../types";
import NavItem from "./NavItem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import  ImageIcon from "@/components/icons/ImageIcon";
import { motion } from "framer-motion";

const itemVariants = { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } };
const itemTransition = { type: "spring", stiffness: 100, damping: 80, mass: 2, velocity: 0 };

interface MobileNavModalProps {
  open: boolean;
  conversationItems: NavItemType[];
  onLogout: () => void | Promise<void>;
  onClose: () => void;
}

export default function MobileNavModal({
  open,
  conversationItems,
  onLogout,
  onClose,
}: MobileNavModalProps) {
  const handleLogout = () => {
    Promise.resolve(onLogout()).finally(onClose);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="w-screen h-screen bg-white shadow-xl rounded-none border-0 p-0 gap-0 outline-none flex flex-col">
        <DialogHeader className="px-4 py-4 flex-shrink-0">
            <DialogTitle className="text-lg font-normal"></DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 p-0 xl:hidden"
            onClick={onClose}
          >
            <ImageIcon height={28} width={28} name="cancel.svg" />
          </Button>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center px-6 pb-6">
            <motion.nav
              className="flex flex-col space-y-2 text-3xl font-bold text-gray-900 font-manrope"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            >
              {conversationItems.map((item) => (
                <motion.div
                  key={item.path}
                  variants={itemVariants}
                  transition={itemTransition}
                >
                  <NavItem item={item} isMobile />
                </motion.div>
              ))}
              <motion.button
                key="logout"
                onClick={handleLogout}
                className="mt-8 text-2xl lowercase font-light text-red-600 hover:text-red-800 transition font-manrope"
                variants={itemVariants}
                transition={itemTransition}
                style={{ marginTop: "2rem", textAlign: "left" }}
              >
                Logout
              </motion.button>
            </motion.nav>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}