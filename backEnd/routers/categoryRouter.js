const express = require('express');
const router = express.Router()
const { authMiddleware, checkIsAdmin } = require('../middlewares/authMiddleware');
const { getCategorys, getCategory, getCategorysAndProduct,  updateCategory, createCategory, deleteCategory } = require('../controller/categoryController');

router.get("/", getCategorys)
router.get("/get-product-belong", authMiddleware, getCategorysAndProduct)
router.get("/:categoryId", authMiddleware, getCategory)

router.put("/:categoryId", authMiddleware,checkIsAdmin, updateCategory)

router.post("/", authMiddleware,checkIsAdmin, createCategory)

router.delete("/:categoryId", authMiddleware,checkIsAdmin, deleteCategory)

module.exports = router;