import { create } from "zustand";

interface ProgressState {
  progress: number;
  uploading: boolean;
  speed: number;
  setProgress: (value: number) => void;
  setUploading: (value: boolean) => void;
  setSpeed: (value: number) => void;
}

export const useProgress = create<ProgressState>((set) => ({
  progress: 0,
  uploading: false,
  speed: 0,
  setProgress: (value) => set({ progress: value }),
  setUploading: (value) => set({ uploading: value }),
  setSpeed: (value) => set({ speed: value }),
}));
