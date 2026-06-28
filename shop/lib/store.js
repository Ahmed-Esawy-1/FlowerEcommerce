import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import authReducer from "../features/auth/authSlice";
import { homeApi } from "./api/homeApi";

export const makeStore = (preloadedState) =>
   configureStore({
      reducer: {
         cart: cartReducer,
         auth: authReducer,
         [homeApi.reducerPath]: homeApi.reducer,
      },

      preloadedState,

      middleware: (getDefaultMiddleware) =>
         getDefaultMiddleware().concat(homeApi.middleware),
   });
