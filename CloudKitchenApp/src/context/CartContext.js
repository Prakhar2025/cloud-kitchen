/**
 * ============================================================================
 * CartContext — Global shared cart state
 * ============================================================================
 * Keeps cart items + subtotal in memory so:
 *  - MenuScreen sees cart count instantly after add
 *  - CartScreen renders instantly (no loading spinner on every action)
 *  - Add / Decrease / Remove updates UI optimistically, then syncs API in bg
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getCart, addToCart, decreaseQuantity, removeFromCart } from '../api/cart';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();

    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal]   = useState(0);
    const [loading, setLoading]     = useState(false);
    // Toast message for brief "Added to cart" feedback
    const [toastMessage, setToastMessage] = useState('');

    // ─── Internal: full refresh from API ─────────────────────────────────────
    const refreshCart = useCallback(async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        const result = await getCart();
        if (result.success) {
            setCartItems(result.data.items  ?? []);
            setSubtotal(result.data.subtotal ?? 0);
        }
        setLoading(false);
    }, [isAuthenticated]);

    // Load cart once on login
    useEffect(() => {
        if (isAuthenticated) {
            refreshCart();
        } else {
            setCartItems([]);
            setSubtotal(0);
        }
    }, [isAuthenticated]);

    // ─── Show a brief toast ───────────────────────────────────────────────────
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 2000);
    };

    // ─── Add item — optimistic then sync ─────────────────────────────────────
    const addItem = useCallback(async (foodItem) => {
        // Optimistic update
        setCartItems(prev => {
            const idx = prev.findIndex(i => i.food_item_id === foodItem.id);
            if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
                return updated;
            }
            return [...prev, {
                id: Date.now(), // temp id
                food_item_id: foodItem.id,
                food_item: foodItem,
                quantity: 1,
            }];
        });
        setSubtotal(prev => prev + parseFloat(foodItem.price || 0));
        showToast(`${foodItem.name} added to cart ✓`);

        // Sync with server in background
        const result = await addToCart(foodItem.id);
        if (!result.success) {
            // Rollback on error
            refreshCart();
        } else {
            // Refresh to get accurate IDs + subtotal from server
            refreshCart();
        }
    }, [refreshCart]);

    // ─── Increase qty (from cart screen +) ───────────────────────────────────
    const increaseItem = useCallback(async (cartItem) => {
        setCartItems(prev => prev.map(i =>
            i.id === cartItem.id ? { ...i, quantity: i.quantity + 1 } : i
        ));
        setSubtotal(prev => prev + parseFloat(cartItem.food_item?.price || 0));

        const result = await addToCart(cartItem.food_item_id);
        if (!result.success) refreshCart();
        else refreshCart();
    }, [refreshCart]);

    // ─── Decrease qty (removes item if qty reaches 0) ────────────────────────
    const decreaseItem = useCallback(async (cartItem) => {
        if (cartItem.quantity <= 1) {
            // Will be removed — optimistic remove
            setCartItems(prev => prev.filter(i => i.id !== cartItem.id));
            setSubtotal(prev => Math.max(0, prev - parseFloat(cartItem.food_item?.price || 0)));
        } else {
            setCartItems(prev => prev.map(i =>
                i.id === cartItem.id ? { ...i, quantity: i.quantity - 1 } : i
            ));
            setSubtotal(prev => Math.max(0, prev - parseFloat(cartItem.food_item?.price || 0)));
        }

        const result = await decreaseQuantity(cartItem.food_item_id);
        if (!result.success) refreshCart();
        else refreshCart();
    }, [refreshCart]);

    // ─── Remove item entirely ─────────────────────────────────────────────────
    const removeItem = useCallback(async (cartItem) => {
        const priceToRemove = parseFloat(cartItem.food_item?.price || 0) * cartItem.quantity;
        setCartItems(prev => prev.filter(i => i.id !== cartItem.id));
        setSubtotal(prev => Math.max(0, prev - priceToRemove));

        const result = await removeFromCart(cartItem.food_item_id);
        if (!result.success) refreshCart();
        else refreshCart();
    }, [refreshCart]);

    // ─── Clear cart (after order placed) ─────────────────────────────────────
    const clearCart = useCallback(() => {
        setCartItems([]);
        setSubtotal(0);
    }, []);

    const cartCount = cartItems.reduce((sum, i) => sum + (i.quantity || 0), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            subtotal,
            loading,
            cartCount,
            toastMessage,
            refreshCart,
            addItem,
            increaseItem,
            decreaseItem,
            removeItem,
            clearCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
};

export default CartContext;
