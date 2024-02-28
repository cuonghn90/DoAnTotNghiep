const express = require('express');
const router = express.Router()
const { authMiddleware } = require('../middlewares/authMiddleware');
const { ratingProduct } = require('../controller/ratingController');

router.post("/", authMiddleware, ratingProduct)

module.exports = router;