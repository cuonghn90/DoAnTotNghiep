const { Friend } = require('../models/userModel')

const getFriendsRepo = async(condition) =>{
    try{
        const friends = await Friend.findAll(condition)
        return friends
    }
    catch(error){
        throw error
    }
}

const getFriendRepo = async (condition) => {
    try {
        const friend = await Friend.findOne(condition)
        return friend
    }
    catch (error) {
        throw error
    }
}

const createFriendRepo = async(newRequest) => {
    try{
        await Friend.create(newRequest)
    }
    catch(error){
        throw error
    }
}

const updateFriendRepo = async (newRequest, condition) => {
    try {
        await Friend.update(newRequest, condition)
    }
    catch (error) {
        throw error
    }
}

const deleteFriendRepo = async (condition) => {
    try {
        await Friend.destroy(condition)
    }
    catch (error) {
        throw error
    }
}

module.exports = { getFriendsRepo, getFriendRepo, createFriendRepo, updateFriendRepo, deleteFriendRepo}