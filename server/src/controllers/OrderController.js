const OrderService = require("../services/OrderService");

// const createOrder = async (req, res) => {
//   try {
//     const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, isPaid, paidAt } = req.body;

//     if (!paymentMethod || !itemsPrice || !shippingPrice || !totalPrice || !fullName || !address || !city || !phone) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "The input is required",
//       });
//     }

//     const response = await OrderService.createOrder(req.body);
//     return res.status(200).json(response);
//   } catch (e) {
//     return res.status(404).json({
//       message: e.message,
//     });
//   }
// };

const createOrder = async (req, res) => {
  try {
    const { paymentMethod, itemsPrice, shippingPrice, totalPrice, shippingAddress, user } = req.body;

    // 1. Kiểm tra các trường root
    // Lưu ý: Không dùng !shippingPrice vì nếu phí là 0 sẽ bị lỗi logic
    if (!paymentMethod || itemsPrice === undefined || shippingPrice === undefined || !totalPrice || !user || !shippingAddress) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required (root fields)",
      });
    }

    // 2. Kiểm tra các trường bên trong shippingAddress
    const { fullName, address, city, phone } = shippingAddress;
    if (!fullName || !address || !city || !phone) {
      return res.status(200).json({
        status: "ERR",
        message: "The shipping address information is required",
      });
    }

    const response = await OrderService.createOrder(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

const getAllOrderByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "User ID is required",
      });
    }

    const response = await OrderService.getAllOrderByUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "Order ID is required",
      });
    }

    const response = await OrderService.cancelOrder(orderId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const response = await OrderService.getAllOrders();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const data = req.body;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "Order ID is required",
      });
    }

    const response = await OrderService.updateOrder(orderId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "Order ID is required",
      });
    }

    const response = await OrderService.deleteOrder(orderId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrderByUser,
  cancelOrder,
  getAllOrders,
  updateOrder,
  deleteOrder
};
