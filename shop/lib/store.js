import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import authReducer from "../features/auth/authSlice";
import { homeApi } from "./api/homeApi";
import { ordersApi } from "./api/ordersApi";
import { authApi } from "./api/authApi";

export const makeStore = (preloadedState) =>
    configureStore({
        reducer: {
            cart: cartReducer,
            auth: authReducer,
            [homeApi.reducerPath]: homeApi.reducer,
            [ordersApi.reducerPath]: ordersApi.reducer,
            [authApi.reducerPath]: authApi.reducer,
        },

        preloadedState,

        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(homeApi.middleware)
                .concat(ordersApi.middleware)
                .concat(authApi.middleware),
    });
