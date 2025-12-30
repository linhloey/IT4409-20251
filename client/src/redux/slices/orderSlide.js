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
    setOrderItems: (state, action) => {
      state.orderItems = action.payload || [];
    },

    addOrderProduct: (state, action) => {
      const { orderItem } = action.payload
      const itemOrder = state?.orderItems?.find((item) => item?.product === orderItem.product)
      if (itemOrder) {
        itemOrder.amount += orderItem?.amount
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
      if (itemOrder && itemOrder.amount > 1) {
        itemOrder.amount--;
      }
    },
    removeOrderProduct: (state, action) => {
      const { idProduct } = action.payload
      state.orderItems = state.orderItems.filter(
        (item) => item.product !== idProduct
      )
    },
    removeManyOrderProduct: (state, action) => {
      const { listChecked } = action.payload; // Mảng các ID sản phẩm đã mua
      state.orderItems = state.orderItems.filter(
        (item) => !listChecked.includes(item.product)
      );
    },
    clearOrder: (state) => {
      state.orderItems = []
      state.shippingAddress = {}
      state.paymentMethod = ''
      state.itemsPrice = 0
      state.shippingPrice = 0
      state.taxPrice = 0
      state.totalPrice = 0
      state.user = '';
    }

  },
});

export const { addOrderProduct, increaseAmount, decreaseAmount, removeOrderProduct, clearOrder, setOrderItems, removeManyOrderProduct } = orderSlide.actions;

export default orderSlide.reducer;