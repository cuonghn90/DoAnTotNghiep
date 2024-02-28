const { Rating, Product, Comment } = require('../models/productModel');

const createCommentRepo = async (newComment) => {
    try {
        const comment = await Comment.create(newComment);
        return comment
    }
    catch (error) {
        throw error
    }
}

const getCommentsByConditionRepo = async (condition) => {
    try {
        const comments = await Comment.findAll(condition);
        return comments
    }
    catch (error) {
        throw error
    }
}

const updateCommentRepo = async (newComment, condition) => {
    try {
        const comment = Comment.update(newComment, condition)
        return comment
    }
    catch (error) {
        throw error
    }
}

const deleteCommentRepo = async (condition) => {
    try {
        await Comment.destroy(condition)
    }
    catch (error) {
        throw error
    }
}

module.exports = {  getCommentsByConditionRepo, createCommentRepo, updateCommentRepo, deleteCommentRepo }