import { create } from 'zustand';
import { type PaginationConfig } from '../algorithms/extractionEngine';

interface PaginationStore {
  paginationConfig: PaginationConfig | undefined;
  setPaginationConfig: (config: PaginationConfig | undefined) => void;
  clearPaginationConfig: () => void;
}

export const usePaginationStore = create<PaginationStore>((set) => ({
  paginationConfig: undefined,
  setPaginationConfig: (config) => set({ paginationConfig: config }),
  clearPaginationConfig: () => set({ paginationConfig: undefined }),
}));
