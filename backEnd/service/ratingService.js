const { v4: uuidv4 } = require('uuid');
const { Rating, Comment } = require('../models/productModel');
const { CustomError } = require("../utils/CustomError");
const { getRatingByConditionRepo, updateRatingRepo, getRatingsByConditionRepo, createRatingRepo } = require('../repository/ratingRepository');
const { getProductByConditionRepo, updateProductRepo } = require('../repository/productRepository');

const ratingProductService = async (req, res) => {
    const { userId } = req.user
    const { productId, star } = req.body
    try {
        const userRatingExist = await getRatingByConditionRepo({ where: { userId: userId, productId: productId } })
        if (userRatingExist && userRatingExist != null) {
            await updateRatingRepo({ star: star }, { where: { userId: userId, productId: productId } })
            const ratingsBelongToProduct = await getRatingsByConditionRepo({ where: { productId: productId } })
            await getProductByConditionRepo({ where: { productId: productId } })
            let totalStar = 0
            for (const ratingItem of ratingsBelongToProduct) {
                totalStar += ratingItem.star
            }
            await updateProductRepo({ totalRating: totalStar }, { where: { productId: productId } })
            res.sendStatus(200)
        }
        else {
            const newRating = {
                ratingId: uuidv4(),
                userId: userId,
                productId: productId,
                star: star,
            }
            await createRatingRepo(newRating)
            const productBeforeRating = await getProductByConditionRepo({ where: { productId: productId } })
            await updateProductRepo({ totalRating: (productBeforeRating.totalRating + star) }, { where: { productId: productId } })
            res.sendStatus(200)
        }
    }
    catch (error) {
        throw new CustomError(error.message, 500)
    }
}


module.exports = {
    ratingProductService
}