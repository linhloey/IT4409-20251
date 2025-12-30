const express = require("express");
const router = express.Router()
const OrderController = require('../controllers/OrderController');
const { authUserMiddleware } = require('../middleware/authMiddleware');

router.post('/create', authUserMiddleware, OrderController.createOrder)
router.get('/get-all-order/:id', authUserMiddleware, OrderController.getAllOrderByUser)
router.delete('/cancel-order/:id', authUserMiddleware, OrderController.cancelOrder)

module.exports = router  