import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import { homeApi } from "./api/homeApi";

export const makeStore = (preloadedState) =>
   configureStore({
      reducer: {
         cart: cartReducer,
         [homeApi.reducerPath]: homeApi.reducer,
      },

      preloadedState,

      middleware: (getDefaultMiddleware) =>
         getDefaultMiddleware().concat(homeApi.middleware),
   });
