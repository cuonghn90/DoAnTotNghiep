const express = require('express');
const router = express.Router()
const { authMiddleware, checkIsAdmin } = require('../middlewares/authMiddleware');
const { getCoupons, filterCoupons, getCoupon, createCoupon, updateCoupon, giveCoupon, deleteCoupon, createCouponUsed, getCouponsUsed, getCouponsAndCheckUsed, createCouponCode } = require('../controller/couponController')

router.get("", authMiddleware, getCoupons)
router.get("/filter", authMiddleware,filterCoupons)
router.get("/coupon-user-used", authMiddleware, getCouponsAndCheckUsed)
router.get("/:couponId", authMiddleware, getCoupon)

router.get("/coupon/used", authMiddleware, getCouponsUsed)

router.put("/:couponId", authMiddleware, checkIsAdmin, updateCoupon)

router.post("/", authMiddleware, checkIsAdmin, createCoupon)

router.post("/give-gift", authMiddleware, giveCoupon)

router.post("/coupon-used", authMiddleware, createCouponUsed)

router.post("/create-coupon-code", authMiddleware, checkIsAdmin, createCouponCode)

router.delete("/:couponId", authMiddleware, checkIsAdmin, deleteCoupon)

module.exports = router;