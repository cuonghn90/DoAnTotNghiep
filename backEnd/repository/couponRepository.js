const { couponSchema: Coupon, couponUsedSchema: CouponUsed } = require("../models/couponModel");

const createCouponRepo = async( newCoupon ) => {
    try{
        await Coupon.create(newCoupon)
    }
    catch(error){
        throw error
    }
}
const updateCouponRepo = async( newCoupon, condition ) => {
    try{
        await Coupon.update(newCoupon,  condition)
    }
    catch(error){
        throw error
    }
}
const deleteCouponRepo = async( condition ) => {
    try{
        await Coupon.destroy(condition)
    }
    catch(error){
        throw error
    }
}
const getCouponsRepo = async(condition) => {
    try{
        const coupons = await Coupon.findAll(condition)
        return coupons
    }
    catch(error){
        throw error
    }
}
const filterCouponsRepo = async(condition) => {
    try{
        const coupons = await Coupon.findAll(condition)
        return coupons
    }
    catch(error){
        throw error
    }
}
const getCouponRepo = async( condition ) => {
    try{
        const coupon = await Coupon.findOne(condition)
        return coupon
    }
    catch(error){
        throw error
    }
}

const getCouponsUsedRepo = async () => {
    try {
        const couponsused = await CouponUsed.findAll()
        console.log(couponsused);
        return couponsused
    }
    catch (error) {
        throw error
    }
}

const createCouponUsedRepo = async( newCouponUsed ) => {
    try{
        await CouponUsed.create(newCouponUsed)
    }
    catch(error){
        throw error
    }
}

const checkCouponUsedExistRepo = async( condition ) => {
    try{
        const couponUsed = await CouponUsed.findOne(condition)
        console.log(couponUsed);
        if (couponUsed && couponUsed !== null){
            return true
        }
        return false
    }
    catch(error){
        throw error
    }
}

module.exports = {
    createCouponRepo,
    getCouponsRepo,
    getCouponRepo,
    deleteCouponRepo,
    updateCouponRepo,
    checkCouponUsedExistRepo,
    createCouponUsedRepo,
    getCouponsUsedRepo,
    filterCouponsRepo
}