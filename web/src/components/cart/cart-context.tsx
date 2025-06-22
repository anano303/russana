import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient, isAuthenticated } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import { CartItem } from "@/types/cart";
import { AxiosError } from "axios";

// Define types for better type safety
// type CartItem = {
//   productId: string;
//   quantity: number;
//   product: any; // Replace with your actual Product type
//   _id?: string;
// };

type CartContextType = {
  cartItems: CartItem[];
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  loadCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoggedIn } = useAuth();
  const loadCart = React.useCallback(async () => {
    // Skip loading if user is not authenticated
    if (!isAuthenticated() || !isLoggedIn) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get("/cart");

      if (response.data && Array.isArray(response.data.items)) {
        setCartItems(response.data.items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error loading cart:", error);

      // If 401, don't show error - just clear cart
      if ((error as AxiosError)?.response?.status === 401) {
        setCartItems([]);
      } else {
        setError("Failed to load cart. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);
  const addToCart = async (productId: string, quantity = 1) => {
    // Check if user is logged in before proceeding
    if (!isAuthenticated() || !isLoggedIn) {
      window.location.href =
        "/login?redirect=" + encodeURIComponent(window.location.pathname);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post("/cart", { productId, quantity });

      if (response.data && Array.isArray(response.data.items)) {
        setCartItems(response.data.items);
      } else {
        // Reload cart to get fresh data
        await loadCart();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);

      if ((error as AxiosError)?.response?.status === 401) {
        window.location.href =
          "/login?redirect=" + encodeURIComponent(window.location.pathname);
      } else {
        setError("Failed to add item to cart. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const updateQuantity = async (productId: string, quantity: number) => {
    // Check if user is logged in before proceeding
    if (!isAuthenticated() || !isLoggedIn) {
      window.location.href =
        "/login?redirect=" + encodeURIComponent(window.location.pathname);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.put(`/cart/${productId}`, { quantity });

      if (response.data && Array.isArray(response.data.items)) {
        setCartItems(response.data.items);
      } else {
        // Reload cart to get fresh data
        await loadCart();
      }
    } catch (error) {
      console.error("Error updating cart item quantity:", error);

      if ((error as AxiosError)?.response?.status === 401) {
        window.location.href =
          "/login?redirect=" + encodeURIComponent(window.location.pathname);
      } else {
        setError("Failed to update item quantity. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const removeFromCart = async (productId: string) => {
    // Check if user is logged in before proceeding
    if (!isAuthenticated() || !isLoggedIn) {
      window.location.href =
        "/login?redirect=" + encodeURIComponent(window.location.pathname);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.delete(`/cart/${productId}`);

      if (response.data && Array.isArray(response.data.items)) {
        setCartItems(response.data.items);
      } else {
        // Reload cart to get fresh data
        await loadCart();
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);

      if ((error as AxiosError)?.response?.status === 401) {
        window.location.href =
          "/login?redirect=" + encodeURIComponent(window.location.pathname);
      } else {
        setError("Failed to remove item from cart. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Load cart when user auth state changes
  useEffect(() => {
    if (isLoggedIn) {
      loadCart();
    } else {
      setCartItems([]);
    }
  }, [isLoggedIn, user?.id, loadCart]); // Added loadCart to dependencies

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        error,
        addToCart,
        updateQuantity,
        removeFromCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
