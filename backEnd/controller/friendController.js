const asyncHandler = require("express-async-handler");
const { getFriendsService, getFriendService, getUserAndCheckFriendService, requestAddFriendService, acceptRequestAddFriendService, updateNumberGiveGiftFriendService, deleteRequestAddFriendService } = require("../service/friendService");

const getFriends = asyncHandler(async (req, res) => {
    try {
        await getFriendsService(req, res)
    }
    catch (error) {
        throw error
    }
})
const getUserAndCheckFriend = asyncHandler(async (req, res) => {
    try {
        await getUserAndCheckFriendService(req, res)
    }
    catch (error) {
        throw error
    }
})

const getFriend = asyncHandler(async (req, res) => {
    try {
        await getFriendService(req, res)
    }
    catch (error) {
        throw error
    }
})



const requestAddFriend = asyncHandler(async (req, res) => {
    try {
        await requestAddFriendService(req, res)
    }
    catch (error) {
        throw error
    }
})


const acceptRequestAddFriend = asyncHandler(async (req, res) => {
    try {
        await acceptRequestAddFriendService(req, res)
    }
    catch (error) {
        throw error
    }
})

const updateNumberGiveGiftFriend = asyncHandler(async (req, res) => {
    try {
        await updateNumberGiveGiftFriendService(req, res)
    }
    catch (error) {
        throw error
    }
})

const deleteRequestAddFriend = asyncHandler(async (req, res) => {
    try {
        await deleteRequestAddFriendService(req, res)
    }
    catch (error) {
        throw error
    }
})

module.exports = { getFriends, getFriend, getUserAndCheckFriend, deleteRequestAddFriend, acceptRequestAddFriend, updateNumberGiveGiftFriend, requestAddFriend }