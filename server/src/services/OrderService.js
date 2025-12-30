const Order = require("../models/OrderProduct");

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt } = newOrder;
    try {
      const createdOrder = await Order.create({
        orderItems,
        shippingAddress: {
          fullName,
          address,
          city,
          phone
        },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        user: user,
        isPaid,
        paidAt
      });
      if (createdOrder) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdOrder,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}

const getAllOrderByUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
      if (orders) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: orders,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}

const cancelOrder = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        resolve({
          status: "ERR",
          message: "Order not found",
        });
        return;
      }

      if (order.isDelivered) {
        resolve({
          status: "ERR",
          message: "Cannot cancel delivered order",
        });
        return;
      }

      if (order.isPaid) {
        return resolve({ 
            status: "ERR", 
            message: "Đơn hàng đã thanh toán, vui lòng liên hệ Admin để hoàn tiền" 
        });
      }

      await Order.findByIdAndDelete(orderId);
      resolve({
        status: "OK",
        message: "Order cancelled successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  createOrder,
  getAllOrderByUser,
  cancelOrder
} 
