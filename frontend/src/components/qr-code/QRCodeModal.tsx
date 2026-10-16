import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { X } from "lucide-react";

interface QRCodeModalProps {
  open: boolean;
  onClose: () => void;
  qrValue: string;
  title?: string;
  primaryButtonText?: string;
  primaryInstruction?: string;
  qrInstruction?: string;
  onPrimaryClick: () => void;
}

export default function QRCodeModal({
  open,
  onClose,
  qrValue,
  title = "how would you like to continue?",
  primaryButtonText = "continue on desktop",
  primaryInstruction = "proceed from your current device",
  qrInstruction = "scan to continue on mobile",
  onPrimaryClick,
}: QRCodeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full bg-white rounded-2xl shadow-xl border-0 p-0 gap-0 outline-none">
        {/* Close button - absolute positioned */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-foreground/5 transition-colors z-10"
        >
          <X size={20} strokeWidth={1.5} className="text-foreground/60" />
        </button>

        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="font-normal text-foreground/80 text-lg text-left lowercase">
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Content: Vertical layout */}
        <div className="flex flex-col items-center px-6 pb-8 gap-6">
          {/* Top: QR Code option */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-light text-foreground/50 lowercase text-center">
              {qrInstruction}
            </p>
            <div className="p-4 bg-white rounded-xl border border-foreground/10 shadow-sm">
              <QRCodeSVG
                value={qrValue}
                size={200}
                bgColor="#FFFFFF"
                fgColor="#1a1a1a"
              />
            </div>
          </div>

          {/* Horizontal Separator */}
          <Divider
            className="w-full font-light"
            borderColor="border-foreground/20"
            textColor="text-foreground/50"
            fontStyle="lowercase"
            text="or"
          />

          {/* Bottom: Desktop option */}
          <div className="flex flex-col items-center gap-3 w-full">
            {/* <p className="text-sm font-light text-foreground/50 lowercase text-center">
              {primaryInstruction}
            </p> */}
            <Button
              variant="default"
              onClick={onPrimaryClick}
              className="font-light rounded-full px-8 py-6 w-full lowercase"
            >
              {primaryButtonText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
