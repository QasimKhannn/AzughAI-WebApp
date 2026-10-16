import { create } from 'zustand';
import { ChatStore } from '../types';

export const useChatStore = create<ChatStore>((set) => ({
  showFinishLoader: false,
  setShowFinishLoader: (show: boolean) => set({ showFinishLoader: show }),

  showScrollLoader: false,
  setShowScrollLoader: (show: boolean) => set({ showScrollLoader: show }),

  openAestheticQuizModal: false,
  setOpenAestheticQuizModal: (open: boolean) => set({ openAestheticQuizModal: open }),

  isCanvasOpen: false,
  setIsCanvasOpen: (open: boolean) => set({ isCanvasOpen: open }),
  toggleCanvas: () => set((state) => ({ isCanvasOpen: !state.isCanvasOpen })),
}));