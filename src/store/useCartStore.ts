// src/store/useCartStore.ts
import { create } from 'zustand';

type CartState = {
  quantity: number;
  setQuantity: (qty: number) => void;
};

export const useCartStore = create<CartState>((set) => ({
  quantity: 0,
  setQuantity: (qty) => set({ quantity: qty }),
}));
