import { create } from 'zustand';
import type { VoiceConnectionState, VoiceTranscript } from '../type';

interface VoiceState {
  isVoiceModalOpen: boolean;
  isListening: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  threadId: string | null;
  connectionState: VoiceConnectionState;
  transcripts: VoiceTranscript[];
  error: string | null;
}

interface VoiceActions {
  openVoiceModal: (threadId: string) => void;
  closeVoiceModal: () => void;
  setListening: (listening: boolean) => void;
  setPlaying: (playing: boolean) => void;
  togglePause: () => void;
  setConnectionState: (state: VoiceConnectionState) => void;
  addTranscript: (transcript: VoiceTranscript) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

type VoiceStore = VoiceState & VoiceActions;

const initialState: VoiceState = {
  isVoiceModalOpen: false,
  isListening: false,
  isPlaying: false,
  isPaused: false,
  threadId: null,
  connectionState: 'idle',
  transcripts: [],
  error: null,
};

export const useVoiceStore = create<VoiceStore>((set) => ({
  ...initialState,

  openVoiceModal: (threadId: string) => {
    //console.log("Opening voice modal for thread:", threadId);
    set({ 
    isVoiceModalOpen: true, 
    isListening: true,
    isPaused: false,
    threadId,
    connectionState: 'connecting',
    transcripts: [],
    error: null,
  })},

  closeVoiceModal: () => {
    //console.log("Closing voice modal");
    set({ 
    isVoiceModalOpen: false,
    isListening: false,
    isPlaying: false,
    isPaused: false,
    connectionState: 'idle',
  })},

  setListening: (listening: boolean) => set({ isListening: listening }),

  setPlaying: (playing: boolean) => set({ isPlaying: playing }),

  togglePause: () => set((state) => ({ 
    isPaused: !state.isPaused,
    isListening: state.isPaused ? true : false,
  })),

  setConnectionState: (connectionState: VoiceConnectionState) => set({ connectionState }),

  addTranscript: (transcript: VoiceTranscript) => set((state) => ({
    transcripts: [...state.transcripts, transcript],
  })),

  setError: (error: string | null) => set({ error, connectionState: error ? 'error' : 'idle' }),

  reset: () => set(initialState),
}));
