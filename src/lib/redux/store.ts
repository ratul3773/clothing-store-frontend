import { configureStore, type UnknownAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import cartReducer from "./slices/cart-slice";
import preferencesReducer from "./slices/preferences-slice";
import { catalogApi } from "./api/products";

type RootState = {
  cart: ReturnType<typeof cartReducer>;
  preferences: ReturnType<typeof preferencesReducer>;
  [catalogApi.reducerPath]: ReturnType<typeof catalogApi.reducer>;
};

const rootReducer = (
  state: RootState | undefined,
  action: UnknownAction,
): RootState => ({
  cart: cartReducer(state?.cart, action),
  preferences: preferencesReducer(state?.preferences, action),
  [catalogApi.reducerPath]: catalogApi.reducer(
    state?.[catalogApi.reducerPath],
    action,
  ),
});

export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefault) => getDefault().concat(catalogApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
