import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  loading: true,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Initialize from localStorage
    INIT: (state, action) => {
      state.cartItems = action.payload || [];
      state.loading = false;
    },

    // Add item to cart
    add: (state, action) => {
      const existing = state.cartItems.find(
        (item) => item.id === action.payload.id,
      );

      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, 3);
      } else {
        state.cartItems.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },

    // Remove item completely
    remove: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload,
      );
    },

    // Increase quantity
    increase: (state, action) => {
      const item = state.cartItems.find((item) => item.id === action.payload);

      if (item) {
        item.quantity = Math.min(item.quantity + 1, 3);
      }
    },

    // Decrease quantity
    decrease: (state, action) => {
      const item = state.cartItems.find((item) => item.id === action.payload);

      if (item) {
        item.quantity = Math.max(item.quantity - 1, 1);
      }
    },


  },
});

export const { INIT, add, remove, increase, decrease } =
  cartSlice.actions;

export default cartSlice.reducer;




// Cart items
export const selectCartItems = (state) => state.cart.cartItems;

// Loading
export const selectCartLoading = (state) => state.cart.loading;

// Number of Items 
export const selectTotalItems = createSelector([selectCartItems], (cartItems) =>
  cartItems.reduce((sum, item) => sum + item.quantity, 0),
);

// total Price 
export const selectTotalPrice = createSelector([selectCartItems], (cartItems) =>
  cartItems.reduce((sum, item) => sum + item.quantity * (item.price || 0), 0),
);

