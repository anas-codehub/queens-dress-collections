import { create }    from "zustand"
import { persist }   from "zustand/middleware"

type CartItem = {
  id:         string
  productId:  string
  variantId?: string
  name:       string
  image:      string
  price:      number
  quantity:   number
  size?:      string
  color?:     string
}

type CartStore = {
  items:          CartItem[]
  isOpen:         boolean
  addItem:        (item: CartItem) => void
  removeItem:     (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void
  clearCart:      () => void
  openCart:       () => void
  closeCart:      () => void
  getTotalItems:  () => number
  getTotalPrice:  () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items:  [],
      isOpen: false,

      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.productId === item.productId && i.size === item.size
        )
        if (existing) {
          set((s) => ({
            items: s.items.map((i) =>
              i.productId === item.productId && i.size === item.size
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }))
        } else {
          set((s) => ({ items: [...s.items, { ...item, quantity: 1 }] }))
        }
      },

      removeItem: (productId, variantId) =>
        set((s) => ({
          items: s.items.filter((i) =>
            variantId
              ? !(i.productId === productId && i.variantId === variantId)
              : i.productId !== productId
          ),
        })),

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId)
          return
        }
        set((s) => ({
          items: s.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity }
              : i
          ),
        }))
      },

      clearCart:     () => set({ items: [] }),
      openCart:      () => set({ isOpen: true  }),
      closeCart:     () => set({ isOpen: false }),
      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getTotalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name:    "qdc-cart",
      storage: typeof window !== "undefined"
        ? {
            getItem:    (key) => {
              const item = localStorage.getItem(key)
              return item ? JSON.parse(item) : null
            },
            setItem:    (key, value) => localStorage.setItem(key, JSON.stringify(value)),
            removeItem: (key) => localStorage.removeItem(key),
          }
        : undefined,
    }
  )
)