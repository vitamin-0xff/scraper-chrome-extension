import { create } from 'zustand';

type ActiveTab = 'root' | 'children' | 'pagination' | 'preview';

interface UIStore {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  resetUIState: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeTab: 'root',
  setActiveTab: (tab) => set({ activeTab: tab }),
  resetUIState: () => set({ activeTab: 'root' }),
}));
