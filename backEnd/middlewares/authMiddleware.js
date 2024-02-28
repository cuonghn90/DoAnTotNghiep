const User = require("../models/userModel").User
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler");
const { json } = require("body-parser");
const { CustomError } = require("../utils/CustomError");

const authMiddleware = asyncHandler(async( req, res, next) => {
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
        try{
            if(token){
                const decoded = jwt.verify(token,process.env.JWT_SECRET);
                const user = await User.findOne({ where: { userId: decoded?.id } })
                if(!user){
                    throw new CustomError("User Not Found", 404)
                }
                req.user = user;
                next()
            }
        }
        catch(error){
            if(error.statusCode == 404 ){
                throw error
            }
            throw new CustomError("Token expired", 401)
        }
    }
    else{
        throw new CustomError("No Token", 401)
    }
})

const checkIsAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user
    const admin = await User.findOne({where : { email: email}})
    if(admin.role !== "admin"){
        throw new CustomError("You are not Admin!", 403)
    }
    else{
        next()
    }
})

module.exports = {
    authMiddleware, 
    checkIsAdmin
}