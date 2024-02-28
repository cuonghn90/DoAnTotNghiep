const {Rating } = require('../models/productModel');

const createRatingRepo = async (newRating) => {
    try {
        const rating = await Rating.create(newRating);
        return rating
    }
    catch (error) {
        throw error
    }
}

const getRatingsByConditionRepo = async (condition) => {
    try {
        const ratings = await Rating.findAll(condition);
        return ratings
    }
    catch (error) {
        throw error
    }
}

const getRatingByConditionRepo = async (condition) => {
    try {
        const rating = await Rating.findOne(condition);
        return rating
    }
    catch (error) {
        throw error
    }
}

const updateRatingRepo = async (newRating, condition) => {
    try {
        const rating = Rating.update(newRating, condition)
        return rating
    }
    catch (error) {
        throw error
    }
}

const deleteRatingRepo = async (condition) => {
    try {
        await Rating.destroy(condition)
    }
    catch (error) {
        throw error
    }
}

module.exports = { getRatingsByConditionRepo, getRatingByConditionRepo, createRatingRepo, updateRatingRepo, deleteRatingRepo }