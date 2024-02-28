const express = require('express');
const router = express.Router()
const { createProduct, filterProduct, getProducts, getProduct, updateProduct, deleteProduct, getProductChatBot } = require('../controller/productController');
const { authMiddleware, checkIsAdmin } = require('../middlewares/authMiddleware');

router.get("", filterProduct)
router.get("/products", getProducts)
router.get("/:productId", getProduct)

router.post("/new-product",authMiddleware, checkIsAdmin,createProduct)

router.post("/get-product-chat-bot",getProductChatBot)

router.put('/:productId',authMiddleware, checkIsAdmin,updateProduct)

router.delete('/:productId',authMiddleware, checkIsAdmin, deleteProduct)
module.exports = router;