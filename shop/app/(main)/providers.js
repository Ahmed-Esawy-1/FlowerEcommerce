"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import CartInitializer from "./cart/CartInitializer";
export function ReduxProvider({ children }) {
  return <Provider store={store}><CartInitializer>{children}</CartInitializer></Provider>;
}
