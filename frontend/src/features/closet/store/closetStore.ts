import { create } from "zustand"

interface ClosetState {
    capturedImages: string[]
    addImage: (image: string) => void
    addImages: (images: string[]) => void
    removeImage: (index: number) => void
    clearImages: () => void
    setImages: (images: string[]) => void
}

export const useClosetStore = create<ClosetState>((set) => ({
    capturedImages: [],
    addImage: (image) =>
        set((state) => ({
            capturedImages: [...state.capturedImages, image]
        })),
    addImages: (images) =>
        set((state) => ({
            capturedImages: [...state.capturedImages, ...images]
        })),
    removeImage: (index) =>
        set((state) => ({
            capturedImages: state.capturedImages.filter((_, i) => i !== index)
        })),
    clearImages: () => set({ capturedImages: [] }),
    setImages: (images) => set({ capturedImages: images })
}))
