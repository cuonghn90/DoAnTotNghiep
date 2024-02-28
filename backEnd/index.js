const express = require('express')
const app = express()
const cors = require("cors");
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const dotenv = require('dotenv').config()

const PORT = process.env.PORT || 4000

const authRouter = require('./routers/authRoute')
const friendRouter = require('./routers/friendRouter')
const productRouter = require('./routers/productRoute')
const categoryRouter = require('./routers/categoryRouter')
const cartRouter = require('./routers/cartRouter')
const orderRouter = require('./routers/orderRouter')
const couponRouter = require('./routers/couponRouter')
const ratingRouter = require('./routers/ratingRouter')
const commentRouter = require('./routers/commentRouter')
const uploadRouter = require('./routers/upload')
const paymentRouter = require('./routers/paymentRoute')

const { notFound, errorHandler } = require('./middlewares/errorHandle');


// dbConnect()

app.use(bodyParser.json({ limit: '50mb', }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))
app.use(cookieParser())
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3007'],
    credentials: true,
}))
app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:3007'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.use('/api/user', authRouter)
app.use('/api/friend', friendRouter)
app.use('/api/rating', ratingRouter)
app.use('/api/product', productRouter)
app.use('/api/category', categoryRouter)
app.use('/api/cart', cartRouter)
app.use('/api/coupon', couponRouter)
app.use('/api/order', orderRouter)
app.use('/api/comment', commentRouter)
app.use('/api/upload', uploadRouter)

app.use('/api/payment', paymentRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running ${PORT}`);
})