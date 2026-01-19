import { create } from 'zustand';
import { type ExtractedItem } from '../algorithms/extractionEngine';

interface ExtractionState {
  status: 'idle' | 'previewing' | 'extracting' | 'completed' | 'error';
  previewData: ExtractedItem[];
  totalData: ExtractedItem[];
  currentPage: number;
  totalPages: number;
  error: string | null;
}

interface ExtractionDataStore {
  extractionState: ExtractionState;
  setExtractionStatus: (status: ExtractionState['status']) => void;
  setPreviewData: (data: ExtractedItem[]) => void;
  setTotalData: (data: ExtractedItem[]) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setExtractionError: (error: string | null) => void;
  resetExtractionState: () => void;
}

const initialExtractionState: ExtractionState = {
  status: 'idle',
  previewData: [],
  totalData: [],
  currentPage: 0,
  totalPages: 0,
  error: null,
};

export const useExtractionDataStore = create<ExtractionDataStore>((set) => ({
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
}));
