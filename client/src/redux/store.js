import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlide";
import userReducer from "./slices/userSlice";
import orderReducer from './slices/orderSlide'

export const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
    order: orderReducer
  },
});
