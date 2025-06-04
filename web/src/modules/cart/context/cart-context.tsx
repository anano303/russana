"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { CartItem } from "@/types/cart";
import { apiClient } from "@/lib/api-client";
import { useUser } from "@/modules/auth/hooks/use-user";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addItem: (productId: string, qty: number) => Promise<void>;
  removeItem: (
    productId: string,
    size?: string,
    color?: string,
    ageGroup?: string
  ) => Promise<void>;
  updateQuantity: (
    productId: string,
    qty: number,
    size?: string,
    color?: string,
    ageGroup?: string
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  addToCart: (
    productId: string,
    quantity?: number,
    size?: string,
    color?: string,
    ageGroup?: string
  ) => Promise<void>;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "cart_items";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  const totalItems = items.reduce((total, item) => total + item.qty, 0);

  const addItem = useCallback(
    async (productId: string, qty: number) => {
      setLoading(true);
      try {
        if (user) {
          const { data } = await apiClient.post("/cart/items", {
            productId,
            qty,
          });
          setItems(data.items);
          toast({
            title: "Item added to cart",
            description: "Your item has been added successfully.",
          });
        } else {
          const response = await apiClient.get(`/products/${productId}`);
          const product = response.data;

          setItems((prevItems) => {
            const existingItem = prevItems.find(
              (item) => item.productId === productId
            );
            if (existingItem) {
              return prevItems.map((item) =>
                item.productId === productId ? { ...item, qty } : item
              );
            } else {
              return [
                ...prevItems,
                { ...product, productId: product._id, qty },
              ];
            }
          });

          toast({
            title: "Item added to cart",
            description: "Your item has been saved locally.",
          });
        }
      } catch (error) {
        toast({
          title: "Error adding item",
          description: "There was a problem adding your item.",
          variant: "destructive",
        });
        console.error("Error adding item to cart:", error);
      } finally {
        setLoading(false);
      }
    },
    [user, toast]
  );

  const addToCart = useCallback(
    async (
      productId: string,
      quantity = 1,
      size = "",
      color = "",
      ageGroup = ""
    ) => {
      setLoading(true);
      try {
        if (user) {
          const { data } = await apiClient.post("/cart/items", {
            productId,
            qty: quantity,
            size,
            color,
            ageGroup,
          });
          setItems(data.items);
        } else {
          const response = await apiClient.get(`/products/${productId}`);
          const product = response.data;

          setItems((prevItems) => {
            const itemKey = `${productId}${size ? `-${size}` : ""}${
              color ? `-${color}` : ""
            }${ageGroup ? `-${ageGroup}` : ""}`;

            const existingItemIndex = prevItems.findIndex(
              (item) =>
                item.productId === productId &&
                item.size === size &&
                item.color === color &&
                item.ageGroup === ageGroup
            );

            if (existingItemIndex >= 0) {
              const updatedItems = [...prevItems];
              updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex],
                qty: updatedItems[existingItemIndex].qty + quantity,
              };
              return updatedItems;
            } else {
              return [
                ...prevItems,
                {
                  ...product,
                  productId: product._id,
                  qty: quantity,
                  size,
                  color,
                  ageGroup,
                  itemKey,
                },
              ];
            }
          });
        }

        toast({
          title: "პროდუქტი დაემატა",
          description: "პროდუქტი წარმატებით დაემატა კალათაში",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "პროდუქტის დამატება ვერ მოხერხდა",
          variant: "destructive",
        });
        console.error("Error adding item to cart:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user, toast]
  );

  const updateQuantity = useCallback(
    async (
      productId: string,
      qty: number,
      size?: string,
      color?: string,
      ageGroup?: string
    ) => {
      setLoading(true);
      try {
        if (user) {
          // For authenticated users, update on server
          const { data } = await apiClient.put(`/cart/items/${productId}`, {
            qty,
            size,
            color,
            ageGroup,
          });
          setItems(data.items);
        } else {
          // For guests, update locally
          setItems((prevItems) => {
            return prevItems.map((item) => {
              // Check if this is the specific variant we want to update
              if (
                item.productId === productId &&
                item.size === size &&
                item.color === color &&
                item.ageGroup === ageGroup
              ) {
                return { ...item, qty };
              }
              return item;
            });
          });

          // Update local storage
          // ...
        }
      } catch (error) {
        console.error("Error updating item quantity:", error);
        // Handle error
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const removeItem = useCallback(
    async (
      productId: string,
      size?: string,
      color?: string,
      ageGroup?: string
    ) => {
      setLoading(true);
      try {
        if (user) {
          // For authenticated users, remove on server
          const { data } = await apiClient.delete(`/cart/items/${productId}`, {
            data: { size, color, ageGroup },
          });
          setItems(data.items);
        } else {
          // For guests, remove locally
          setItems((prevItems) =>
            prevItems.filter(
              (item) =>
                !(
                  item.productId === productId &&
                  item.size === size &&
                  item.color === color &&
                  item.ageGroup === ageGroup
                )
            )
          );

          // Update local storage
          // ...
        }
      } catch (error) {
        console.error("Error removing item from cart:", error);
        // Handle error
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const clearCart = useCallback(async () => {
    setLoading(true);
    try {
      if (user) {
        await apiClient.delete("/cart");
      }
      setItems([]);
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error clearing cart",
        description: "There was a problem clearing your cart.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const mergeCarts = useCallback(
    async (localItems: CartItem[], serverItems: CartItem[]) => {
      const serverItemsMap = new Map(
        serverItems.map((item) => [item.productId, item])
      );

      for (const localItem of localItems) {
        const serverItem = serverItemsMap.get(localItem.productId);
        if (serverItem) {
          await updateQuantity(
            localItem.productId,
            Math.max(localItem.qty, serverItem.qty)
          );
        } else {
          await addItem(localItem.productId, localItem.qty);
        }
      }
    },
    [updateQuantity, addItem]
  );

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        if (user) {
          const localCart = localStorage.getItem(CART_STORAGE_KEY);
          const localItems = localCart ? JSON.parse(localCart) : [];

          const { data } = await apiClient.get("/cart");

          if (localItems.length > 0) {
            toast({
              title: "Syncing your cart...",
              description: "We're adding your saved items to your account.",
            });
            await mergeCarts(localItems, data.items);
            toast({
              title: "Cart synced!",
              description: "Your items have been saved to your account.",
            });
            localStorage.removeItem(CART_STORAGE_KEY);
          } else {
            setItems(data.items);
          }
        } else {
          const storedCart = localStorage.getItem(CART_STORAGE_KEY);
          if (storedCart) {
            setItems(JSON.parse(storedCart));
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user, mergeCarts, toast]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, user]);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        addToCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
