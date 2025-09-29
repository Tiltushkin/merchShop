import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../shared/types/types";
import utils from "../../utils/utils";
import type {RootState} from "../store.ts";

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    open: boolean;
}

const initialState: CartState = {
    items: [],
    open: false,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<Product>) => {
            const prod = action.payload;
            const item = state.items.find(i => i.product.id === prod.id);
            if (item) item.quantity += 1;
            else state.items.push({ product: prod, quantity: 1 });
        },
        removeItem: (state, action: PayloadAction<number>) => {
            const id = action.payload;
            state.items = state.items.filter(i => i.product.id !== id);
        },
        decrementItem: (state, action: PayloadAction<number>) => {
            const id = action.payload;
            const item = state.items.find(i => i.product.id === id);
            if (!item) return;
            item.quantity -= 1;
            if (item.quantity <= 0) state.items = state.items.filter(i => i.product.id !== id);
        },
        setQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(i => i.product.id === id);
            if (item) {
                item.quantity = Math.max(0, Math.floor(quantity));
                if (item.quantity === 0) state.items = state.items.filter(i => i.product.id !== id);
            }
        },
        clear: (state) => {
            state.items = [];
        },
        toggleOpen: (state) => {
            state.open = !state.open;
        },
        open: (state) => { state.open = true; },
        close: (state) => { state.open = false; },
    },
});

export const { addItem, removeItem, decrementItem, setQuantity, clear, toggleOpen, open, close } = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items as CartItem[];
export const selectCartCount = (state: RootState) => state.cart.items.reduce((s: number, i: CartItem) => s + i.quantity, 0);
export const selectCartTotal = (state: RootState) => state.cart.items.reduce((s: number, i: CartItem) => s + utils.calcWithDiscount(i.product.cost, i.product.discount) * i.quantity, 0);
export const selectCartOpen = (state: RootState) => state.cart.open as boolean;

export default cartSlice.reducer;
