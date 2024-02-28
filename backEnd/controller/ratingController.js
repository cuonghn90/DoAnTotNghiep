const asyncHandler = require("express-async-handler");
const { ratingProductService } = require("../service/ratingService");

const ratingProduct = asyncHandler(async (req, res) => {
    try {
        await ratingProductService(req, res)
    }
    catch (error) {
        throw error
    }
})


module.exports = {
    ratingProduct
}