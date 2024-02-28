const express = require('express');
const router = express.Router()
const { deleteCart, pushProductIntoCart, createCart, getCartBelongToUser, deletProductIncart } = require('../controller/cartController');
const { authMiddleware } = require('../middlewares/authMiddleware');


router.get("/",authMiddleware, getCartBelongToUser)

router.post("/new-cart",authMiddleware, createCart)

router.put('/update-cart', authMiddleware, pushProductIntoCart)

router.delete('/', authMiddleware, deleteCart)

router.delete('/delete-product/:productCartId', authMiddleware, deletProductIncart)

module.exports = router;