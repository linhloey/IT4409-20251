const express = require("express");
const router = express.Router()
const OrderController = require('../controllers/OrderController');
const { authUserMiddleware, authMiddleware } = require('../middleware/authMiddleware');

router.post('/create', authUserMiddleware, OrderController.createOrder)
router.get('/get-all-order/:id', authUserMiddleware, OrderController.getAllOrderByUser)
router.delete('/cancel-order/:id', authUserMiddleware, OrderController.cancelOrder)
router.get('/get-all', authMiddleware, OrderController.getAllOrders)
router.put('/update/:id', authMiddleware, OrderController.updateOrder)
router.delete('/delete/:id', authMiddleware, OrderController.deleteOrder)

module.exports = router  