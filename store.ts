import { create } from "zustand";

export type StoreState = {
  renderKey: number;

  list: 'flash-list' | 'legend-list' | 'flat-list';
  setList: (list: 'flash-list' | 'legend-list' | 'flat-list') => void;

  enableScrollView: boolean;
  toggleScrollView: () => void;

  viewableItems: number[];
  setViewableItems: (...index: number[]) => void;

  renderedItems: number[];
  setRenderedItem: (index: number) => void;
};

export const useRenderStore = create<StoreState>((set) => ({
  renderKey: 0,

  list: 'flat-list',
  setList: (list) => set(() => ({ list, viewableItems: [], renderedItems: [], renderKey: performance.now() })),

  enableScrollView: false,
  toggleScrollView: () => set(({ enableScrollView }) => ({ enableScrollView: !enableScrollView, viewableItems: [], renderedItems: [], renderKey: performance.now() })),

  viewableItems: [] as number[],
  setViewableItems: (...index: number[]) => set(({ viewableItems }) => ({ viewableItems: Array.from(new Set([...viewableItems, ...index])).sort((a, b) => a - b) })),

  renderedItems: [] as number[],
  setRenderedItem: (index: number) => set(({ renderedItems }) => ({ renderedItems: Array.from(new Set([...renderedItems, index])).sort((a, b) => a - b) })),
}));