import { create } from 'zustand';
import { ChildElement } from '../types';

interface ChildElementsStore {
  childElements: ChildElement[];
  addChildElement: (child: ChildElement) => void;
  removeChildElement: (id: string) => void;
  setChildElements: (children: ChildElement[]) => void;
  clearChildElements: () => void;
}

export const useChildElementsStore = create<ChildElementsStore>((set) => ({
  childElements: [],
  addChildElement: (child) =>
    set((state) => ({
      childElements: [...state.childElements, child],
    })),
  removeChildElement: (id) =>
    set((state) => ({
      childElements: state.childElements.filter((child) => child.id !== id),
    })),
  setChildElements: (children) => set({ childElements: children }),
  clearChildElements: () => set({ childElements: [] }),
}));
