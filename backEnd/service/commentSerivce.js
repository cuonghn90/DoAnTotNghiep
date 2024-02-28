const { v4: uuidv4 } = require('uuid');
const { Rating, Comment } = require('../models/productModel');
const { validateMysql } = require("../utils/validateMysql");
const { CustomError } = require("../utils/CustomError");
const { getProductByConditionRepo } = require("../repository/productRepository");
const { createCommentRepo, getCommentsByConditionRepo, updateCommentRepo, deleteCommentRepo } = require("../repository/commentRepository");
const { getUserByConditionRepo } = require("../repository/userRepository");

const createCommentService = async (req, res) => {
    const { userId } = req.user
    const { productId, text } = req.body
    validateMysql(userId)
    try {
        const product = await getProductByConditionRepo({ where: { productId: productId } })
        if (!product) {
            throw new CustomError("Sản phẩm này không tồn tại!", 404)
        }
        const comment = {
            commentId: uuidv4(),
            userId: userId,
            productId: productId,
            text: text,
        }
        await createCommentRepo(comment)
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}

const getCommentsByProductIdService = async (req, res) => {
    const { productId } = req.params
    try {
        const product = await getProductByConditionRepo({ where: { productId: productId } })
        if (!product) {
            throw new CustomError("Sản phẩm này không tồn tại!", 404)
        }
        const comments = await getCommentsByConditionRepo({ where: { productId: productId } })
        const response = []
        for (const comment of comments) {
            const userOfComment = await getUserByConditionRepo({ where: { userId: comment.userId } })
            response.push({
                ...comment.dataValues,
                user: {
                    userId: userOfComment.userId,
                    username: userOfComment.username,
                    firstname: userOfComment.firstname,
                    lastname: userOfComment.lastname,
                    email: userOfComment.email,
                    phone: userOfComment.phone,
                    avatar: userOfComment.avatar,
                }
            })
        }
        res.json(response)
    }
    catch (error) {
        throw error
    }
}

const updateCommentService = async (req, res) => {
    const { userId } = req.user
    const { productId, text, commentId } = req.body
    try {
        const product = await getProductByConditionRepo({ where: { productId: productId } })
        if (!product) {
            throw new CustomError("Sản phẩm này không tồn tại!", 404)
        }
        await updateCommentRepo({ text: text }, { where: { commentId: commentId, userId: userId } })
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}

const deleteCommentByUserIdService = async (req, res) => {
    const { userId } = req.user
    const { commentId, productId } = req.body
    try {
        const product = await getProductByConditionRepo({ where: { productId: productId } })
        if (!product) {
            throw new CustomError("Sản phẩm này không tồn tại!", 404)
        }
        await deleteCommentRepo({ where: { userId: userId, commentId: commentId } })
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}


module.exports = {
    createCommentService,
    getCommentsByProductIdService,
    updateCommentService,
    deleteCommentByUserIdService
}