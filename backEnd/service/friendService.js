const { v4: uuidv4 } = require('uuid');
const { getFriendsRepo, getFriendRepo, createFriendRepo, updateFriendRepo, deleteFriendRepo } = require('../repository/friendRepository');
const { CustomError } = require('../utils/CustomError');
const { User } = require('../models/userModel');
const { getUserByConditionRepo, getUsersRepo } = require('../repository/userRepository');
const { Op } = require('sequelize');

const getFriendsService = async (req, res) => {
    try {
        const friends1 = await getFriendsRepo({ where: { userId: req.user.userId } })
        const friends2 = await getFriendsRepo({ where: { userFriendId: req.user.userId } })
        const friends = friends1.concat(friends2)
        const friendsRepsone = []
        for (const friend of friends) {
            let user
            if (friend.userId == req.user.userId) {
                user = await getUserByConditionRepo({ where: { userId: friend.userFriendId }, attributes: ['userId', 'username', 'firstname', 'lastname', 'email', 'phone', 'avatar', 'address'] })
            }
            else {
                user = await getUserByConditionRepo({ where: { userId: friend.userId }, attributes: ['userId', 'username', 'firstname', 'lastname', 'email', 'phone', 'avatar', 'address'] })
            }
            friendsRepsone.push({
                ...friend.dataValues,
                userFriendInfo: user
            })
        }
        res.json(friendsRepsone)
    }
    catch (error) {
        throw error
    }
}

const getUserAndCheckFriendService = async (req, res) => {
    try {
        const search = req.query.search || ''
        const users = await getUsersRepo({ where: { username: { [Op.substring]: [search] }, userId: { [Op.ne]: [req.user.userId] } }, attributes: ['userId', 'username', 'firstname', 'lastname', 'email', 'phone', 'avatar', 'address'] })
        const usersRepsone = []
        for (const user of users) {
            let friend = await getFriendRepo({ where: { userId: req.user.userId, userFriendId: user.userId } })
            if (friend == null) {
                friend = await getFriendRepo({ where: { userId: user.userId, userFriendId: req.user.userId } })
            }
            if (friend == null) {
                usersRepsone.push({
                    sendRequest: false,
                    isFriend: false,
                    userFriendInfo: user,
                })
            }
            else {
                usersRepsone.push({
                    ...friend.dataValues,
                    sendRequest: true,
                    isFriend: friend.isFriend,
                    userFriendInfo: user,
                })
            }

        }
        res.json(usersRepsone)
    }
    catch (error) {
        throw error
    }
}

const getFriendService = async (req, res) => {
    const { userFriendId } = req.params
    if (!userFriendId) {
        throw new CustomError("Định danh bạn bè không hợp lệ.", 400)
    }
    try {
        let friend = await getFriendRepo({ where: { userId: req.user.userId, userFriendId: userFriendId } })
        if (friend == null) {
            friend = await getFriendRepo({ where: { userId: userFriendId, userFriendId: req.user.userId } })
            if (friend == null) {
                throw new CustomError("Không tìm thấy người bạn này.", 400)
            }
        }
        const user = await getUserByConditionRepo({ where: { userId: userFriendId }, attributes: ['userId', 'username', 'firstname', 'lastname', 'email', 'phone', 'avatar', 'address'] })
        res.json({
            ...friend.dataValues,
            userFriendInfo: user
        })
    }
    catch (error) {
        throw error
    }
}

const requestAddFriendService = async (req, res) => {
    const { userFriendId } = req.body
    if (!userFriendId) {
        throw new CustomError("Định danh bạn bè không hợp lệ.", 400)
    }
    try {
        const user = await getUserByConditionRepo({ where: { userId: userFriendId }, attributes: ['userId', 'username', 'firstname', 'lastname', 'email', 'phone', 'avatar', 'address'] })
        if (user == null) {
            throw new CustomError("Người này không tồn tại", 400)
        }
        const newRequestFriend = {
            userId: req.user.userId,
            userFriendId: userFriendId,
            isFriend: false,
            numberGiveGift: 0
        }
        await createFriendRepo(newRequestFriend)
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}


const acceptRequestAddFriendService = async (req, res) => {
    const { userFriendId } = req.body
    if (!userFriendId) {
        throw new CustomError("Định danh bạn bè không hợp lệ.", 400)
    }
    try {
        const newRequestFriend = {
            isFriend: true
        }
        let friend = await getFriendRepo({ where: { userId: req.user.userId, userFriendId: userFriendId } })
        if (friend == null) {
            friend = await getFriendRepo({ where: { userId: userFriendId, userFriendId: req.user.userId } })
            if (friend == null) {
                throw new CustomError("Không tìm thấy người bạn này.", 400)
            }
            else {
                await updateFriendRepo(newRequestFriend, { where: { userId: userFriendId, userFriendId: req.user.userId } })
            }
        }
        else {
            await updateFriendRepo(newRequestFriend, { where: { userId: req.user.userId, userFriendId: userFriendId } })
        }
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}

const updateNumberGiveGiftFriendService = async (req, res) => {
    const { userFriendId } = req.body
    if (!userFriendId) {
        throw new CustomError("Định danh bạn bè không hợp lệ.", 400)
    }
    try {
        const newRequestFriend = {
            numberGiveGift: 0
        }
        let friend = await getFriendRepo({ where: { userId: req.user.userId, userFriendId: userFriendId } })
        if (friend == null) {
            friend = await getFriendRepo({ where: { userId: userFriendId, userFriendId: req.user.userId } })
            if (friend == null) {
                throw new CustomError("Không tìm thấy người bạn này.", 400)
            }
            else {
                await updateFriendRepo({ newRequestFriend: (friend.numberGiveGift + 1) }, { where: { userId: userFriendId, userFriendId: req.user.userId } })
            }
        }
        else {
            await updateFriendRepo({ newRequestFriend: (friend.numberGiveGift + 1) }, { where: { userId: req.user.userId, userFriendId: userFriendId } })
        }
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}

const deleteRequestAddFriendService = async (req, res) => {
    const { userFriendId } = req.params
    if (!userFriendId) {
        throw new CustomError("Định danh bạn bè không hợp lệ.", 400)
    }
    try {
        let friend = await getFriendRepo({ where: { userId: req.user.userId, userFriendId: userFriendId } })
        if (friend == null) {
            friend = await getFriendRepo({ where: { userId: userFriendId, userFriendId: req.user.userId } })
            if (friend == null) {
                throw new CustomError("Không tìm thấy người bạn này.", 400)
            }
            else {
                await deleteFriendRepo({ where: { userId: userFriendId, userFriendId: req.user.userId } })
            }
        }
        else {
            await deleteFriendRepo({ where: { userId: req.user.userId, userFriendId: userFriendId } })
        }
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}

module.exports = { getFriendsService, getFriendService, getUserAndCheckFriendService, deleteRequestAddFriendService, acceptRequestAddFriendService, updateNumberGiveGiftFriendService,requestAddFriendService }