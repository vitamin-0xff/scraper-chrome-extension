import { create } from 'zustand';
import { ChildElement } from '../types';
import { type PaginationConfig, type ExtractedItem } from '../algorithms/extractionEngine';

interface RootElementInfo {
  selector: string;
  index: number;
}

interface ExtractionState {
  status: 'idle' | 'previewing' | 'extracting' | 'completed' | 'error';
  previewData: ExtractedItem[];
  totalData: ExtractedItem[];
  currentPage: number;
  totalPages: number;
  error: string | null;
}

interface ExtractionStore {
  // Root element state
  rootElementInfo: RootElementInfo | null;
  setRootElementInfo: (selector: string, index: number) => void;
  clearRootElementInfo: () => void;

  // Child elements state
  childElements: ChildElement[];
  addChildElement: (child: ChildElement) => void;
  removeChildElement: (id: string) => void;
  setChildElements: (children: ChildElement[]) => void;
  clearChildElements: () => void;

  // Pagination config state
  paginationConfig: PaginationConfig | undefined;
  setPaginationConfig: (config: PaginationConfig | undefined) => void;
  clearPaginationConfig: () => void;

  // Extraction state
  extractionState: ExtractionState;
  setExtractionStatus: (status: ExtractionState['status']) => void;
  setPreviewData: (data: ExtractedItem[]) => void;
  setTotalData: (data: ExtractedItem[]) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setExtractionError: (error: string | null) => void;
  resetExtractionState: () => void;

  // Active tab
  activeTab: 'root' | 'children' | 'pagination' | 'preview';
  setActiveTab: (tab: 'root' | 'children' | 'pagination' | 'preview') => void;

  // Reset all state
  resetAll: () => void;
}

const initialExtractionState: ExtractionState = {
  status: 'idle',
  previewData: [],
  totalData: [],
  currentPage: 0,
  totalPages: 0,
  error: null,
};

export const useExtractionStore = create<ExtractionStore>((set) => ({
  // Root element
  rootElementInfo: null,
  setRootElementInfo: (selector, index) =>
    set({ rootElementInfo: { selector, index } }),
  clearRootElementInfo: () => set({ rootElementInfo: null }),

  // Child elements
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

  // Pagination config
  paginationConfig: undefined,
  setPaginationConfig: (config) => set({ paginationConfig: config }),
  clearPaginationConfig: () => set({ paginationConfig: undefined }),

  // Extraction state
  extractionState: initialExtractionState,
  setExtractionStatus: (status) =>
    set((state) => ({
      extractionState: { ...state.extractionState, status },
    })),
  setPreviewData: (data) =>
    set((state) => ({
      extractionState: { ...state.extractionState, previewData: data },
    })),
  setTotalData: (data) =>
    set((state) => ({
      extractionState: { ...state.extractionState, totalData: data },
    })),
  setCurrentPage: (page) =>
    set((state) => ({
      extractionState: { ...state.extractionState, currentPage: page },
    })),
  setTotalPages: (pages) =>
    set((state) => ({
      extractionState: { ...state.extractionState, totalPages: pages },
    })),
  setExtractionError: (error) =>
    set((state) => ({
      extractionState: { ...state.extractionState, error },
    })),
  resetExtractionState: () =>
    set({ extractionState: initialExtractionState }),

  // Active tab
  activeTab: 'root',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Reset all
  resetAll: () =>
    set({
      rootElementInfo: null,
      childElements: [],
      paginationConfig: undefined,
      extractionState: initialExtractionState,
      activeTab: 'root',
    }),
}));
