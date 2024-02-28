const express = require('express');
const { getPaymentConfig } = require('../controller/paymentController');
const router = express.Router()
router.get('/paypal-key', getPaymentConfig)

module.exports = router