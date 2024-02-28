const asyncHandler = require("express-async-handler");
const { getCouponsService, getCouponsAndCheckUsedService, getCouponService, createCouponService, giveCouponService, updateCouponService, deleteCouponService, createCouponUsedService, filterCouponsService, getCouponsUsedService, createCouponCodeService } = require("../service/couponService");


const getCoupons = asyncHandler(async (req, res) => {
    try {
        await getCouponsService(req, res)
    }
    catch (error) {
        throw error
    }
})

const getCouponsAndCheckUsed = asyncHandler(async (req, res) => {
    try {
        await  getCouponsAndCheckUsedService(req, res)
    }
    catch (error) {
        throw error
    }
})

const filterCoupons = asyncHandler(async (req, res) => {
    try {
        await filterCouponsService(req, res)
    }
    catch (error) {
        throw error
    }
})

const getCoupon = asyncHandler(async (req, res) => {
    try {
        await getCouponService(req, res)
    }
    catch (error) {
        throw error
    }
})

const createCoupon = asyncHandler(async (req, res) => {
    try {
        await createCouponService(req, res)
    }
    catch (error) {
        throw error
    }
})

const createCouponCode = asyncHandler(async (req, res) => {
    try {
        await createCouponCodeService(req, res)
    }
    catch (error) {
        throw error
    }
})

const giveCoupon = asyncHandler(async (req, res) => {
    try {
        await giveCouponService(req, res)
    }
    catch (error) {
        throw error
    }
})

const updateCoupon = asyncHandler(async (req, res) => {
    try {
        await updateCouponService(req, res)
    }
    catch (error) {
        throw error
    }
})

const deleteCoupon = asyncHandler(async (req, res) => {
    try {
        await deleteCouponService(req, res)
    }
    catch (error) {
        throw error
    }
})

const getCouponsUsed = asyncHandler(async (req, res) => {
    try {
        await getCouponsUsedService(req, res)
    }
    catch (error) {
        throw error
    }
})

const createCouponUsed = asyncHandler(async (req, res) => {
    try {
        await createCouponUsedService(req, res)
    }
    catch (error) {
        throw error
    }
})


module.exports = { getCoupons, getCouponsAndCheckUsed, getCoupon, createCoupon, createCouponCode, giveCoupon, updateCoupon, deleteCoupon, filterCoupons, getCouponsUsed, createCouponUsed }