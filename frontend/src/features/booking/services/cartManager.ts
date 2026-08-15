// Cart Manager with localStorage persistence — Swiggy/Zomato Style
export interface CartItem {
  id: string;          // unique per service (not per addition)
  serviceName: string;
  category: string;
  categorySlug: string;
  price: number;
  quantity: number;
  duration?: string;
  date?: string;
  time?: string;
  address?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
  categorySlug?: string;
}

const CART_STORAGE_KEY = 'visvasahome_cart';

function recalc(items: CartItem[]): { total: number; itemCount: number } {
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  return { total, itemCount };
}

export const CartManager = {
  /** Get cart from localStorage */
  getCart(): Cart {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) return { items: [], total: 0, itemCount: 0 };
      const parsed = JSON.parse(stored) as Cart;
      // back-compat: old items might not have quantity
      parsed.items = (parsed.items || []).map(i => ({ ...i, quantity: i.quantity ?? 1 }));
      const { total, itemCount } = recalc(parsed.items);
      return { ...parsed, total, itemCount };
    } catch {
      return { items: [], total: 0, itemCount: 0 };
    }
  },

  /** Save cart to localStorage + fire custom event so other components update */
  saveCart(cart: Cart): void {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('visvasahome_cart_updated', { detail: cart }));
  },

  /** Increment quantity (or add new item) */
  addItem(item: Omit<CartItem, 'quantity'>): Cart {
    const cart = this.getCart();

    // Category switch guard
    if (cart.items.length > 0 && cart.categorySlug && cart.categorySlug !== item.categorySlug) {
      return cart; // caller must handle this with a dialog
    }

    const existing = cart.items.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.items.push({ ...item, quantity: 1 });
    }

    const { total, itemCount } = recalc(cart.items);
    const updated: Cart = { ...cart, total, itemCount, categorySlug: item.categorySlug };
    this.saveCart(updated);
    return updated;
  },

  /** Decrement quantity (removes item when 0) */
  decrementItem(itemId: string): Cart {
    const cart = this.getCart();
    const existing = cart.items.find(i => i.id === itemId);
    if (existing) {
      existing.quantity -= 1;
      if (existing.quantity <= 0) {
        cart.items = cart.items.filter(i => i.id !== itemId);
      }
    }
    const { total, itemCount } = recalc(cart.items);
    const updated: Cart = {
      ...cart,
      total,
      itemCount,
      categorySlug: cart.items.length === 0 ? undefined : cart.categorySlug,
    };
    this.saveCart(updated);
    return updated;
  },

  /** Remove item entirely (all quantities) */
  removeItem(itemId: string): Cart {
    const cart = this.getCart();
    cart.items = cart.items.filter(i => i.id !== itemId);
    const { total, itemCount } = recalc(cart.items);
    const updated: Cart = {
      ...cart,
      total,
      itemCount,
      categorySlug: cart.items.length === 0 ? undefined : cart.categorySlug,
    };
    this.saveCart(updated);
    return updated;
  },

  /** Clear entire cart */
  clearCart(): void {
    localStorage.removeItem(CART_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('visvasahome_cart_updated', { detail: { items: [], total: 0, itemCount: 0 } }));
  },

  /** Check if item is in cart */
  isInCart(itemId: string): boolean {
    return this.getCart().items.some(i => i.id === itemId);
  },

  /** Get quantity of a specific item */
  getQuantity(itemId: string): number {
    return this.getCart().items.find(i => i.id === itemId)?.quantity ?? 0;
  },

  /** Get total item count (sum of all quantities) */
  getCount(): number {
    return this.getCart().itemCount ?? 0;
  },
};
