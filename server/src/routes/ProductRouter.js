const express = require("express");
const router = express.Router() 
const productController = require('../controllers/ProductController');
const { authMiddleware } = require('../middleware/authMiddleware');  

router.post('/create', productController.createProduct)
router.put('/update/:id', authMiddleware, productController.updateProduct)
router.get('/get-details/:id', productController.getDetailsProduct)
router.delete('/delete/:id', authMiddleware, productController.deleteProduct)
router.get('/get-all', productController.getAllProduct)
router.post('/delete-many', authMiddleware, productController.deleteMany)
router.get('/get-all-type', productController.getAllType)
router.get('/get-type', productController.getProductType)

module.exports = router