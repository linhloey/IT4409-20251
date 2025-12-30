import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  orderItems: [
  ],
  shippingAddress: {
  },
  paymentMethod: '',
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  user: '',
  isPaid: false,
  paidAt: '',
  isDelivered: false,
  deliveredAt: '',
};

export const orderSlide = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const { orderItem } = action.payload
      const itemOrder = state?.orderItems?.find((item) => item?.product === orderItem.product)
      if (itemOrder) {
        itemOrder.amount = orderItem?.amount
      } else {
        state.orderItems.push(orderItem)
      }
    },
    increaseAmount: (state, action) => {
      const { idProduct } = action.payload
      const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
      itemOrder.amount++
    },
    decreaseAmount: (state, action) => {
      const { idProduct } = action.payload
      const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
      itemOrder.amount--
    },
    removeOrderProduct: (state, action) => {
      const { idProduct } = action.payload
      state.orderItems = state.orderItems.filter(
        (item) => item.product !== idProduct
      )
    },
    clearOrder: (state) => {
      state.orderItems = []
      state.shippingAddress = {}
      state.paymentMethod = ''
      state.itemsPrice = 0
      state.shippingPrice = 0
      state.taxPrice = 0
      state.totalPrice = 0
    }

  },
});

export const { addOrderProduct, increaseAmount, decreaseAmount, removeOrderProduct, clearOrder } = orderSlide.actions;

export default orderSlide.reducer;