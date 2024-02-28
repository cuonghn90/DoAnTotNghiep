const asyncHandler = require("express-async-handler");
const dotenv = require('dotenv').config()

const getPaymentConfig = asyncHandler(async (req, res) => {
    res.status(200).json({
        data: process.env.CLIENT_ID,
        status: 200
    })
})
module.exports = { getPaymentConfig}