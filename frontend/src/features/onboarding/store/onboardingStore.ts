import { create } from "zustand";

interface OnboardingModalState {
  showFinishLoader: boolean;
  openFinishLoader: () => void;
  closeFinishLoader: () => void;
  showSummaryPopup: boolean;
  openSummaryPopup: () => void;
  closeSummaryPopup: () => void;
  showChatRevealLoader?: boolean;
  openChatRevealLoader?: () => void;
  closeChatRevealLoader?: () => void;
  userName: string;
  setUserName: (name: string) => void;
}

export const useOnboardingModal = create<OnboardingModalState>((set) => ({
  showFinishLoader: false,
  openFinishLoader: () => set({ showFinishLoader: true }),
  closeFinishLoader: () => set({ showFinishLoader: false }),
  showSummaryPopup: false,
  openSummaryPopup: () => set({ showSummaryPopup: true }),
  closeSummaryPopup: () => set({ showSummaryPopup: false }),
  showChatRevealLoader: false,
  openChatRevealLoader: () => set({ showChatRevealLoader: true }),
  closeChatRevealLoader: () => set({ showChatRevealLoader: false }),
  userName: "",
  setUserName: (name: string) => set({ userName: name }),
}));