import { create } from 'zustand';

interface RootElementInfo {
  selector: string;
  index: number;
}

interface RootElementStore {
  rootElementInfo: RootElementInfo | null;
  setRootElementInfo: (selector: string, index: number) => void;
  clearRootElementInfo: () => void;
}

export const useRootElementStore = create<RootElementStore>((set) => ({
  rootElementInfo: null,
  setRootElementInfo: (selector, index) =>
    set({ rootElementInfo: { selector, index } }),
  clearRootElementInfo: () => set({ rootElementInfo: null }),
}));
