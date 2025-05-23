'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id?: string
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQuantity: (name: string) => void
  removeItem: (name: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.name === item.name)
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i.name === item.name 
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          }
        }
        return { items: [...state.items, { ...item, quantity: item.quantity || 1 }] }
      }),
      updateQuantity: (name) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.name === name
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        })),
      removeItem: (name) =>
        set((state) => ({
          items: state.items.filter((item) => item.name !== name),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
)