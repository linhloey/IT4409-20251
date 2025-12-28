import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlide";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer
  },
});
