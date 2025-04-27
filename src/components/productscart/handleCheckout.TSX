import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQuantity: (name: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.name === item.name && i.price === item.price)
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.name === item.name && i.price === item.price
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          } else {
            return { items: [...state.items, item] }
          }
        }),
      updateQuantity: (name) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.name === name ? { ...item, quantity: item.quantity + 1 } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // Key for localStorage
    }
  )
)
