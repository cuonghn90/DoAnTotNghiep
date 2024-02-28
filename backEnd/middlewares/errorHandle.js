// notFound

const notFound = (req, res, next) => {
    const error = new Error(`Not found url`);
    error.statusCode = 404
    next(error)
}

// Error Handler

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode == 200 ? 500 : err.statusCode;
    console.log(err);
    res.status(statusCode)
    res.json({
        message: err?.message,
        statusCode: err?.statusCode,
        stack: err?.stack,
    })
}

module.exports = { errorHandler, notFound}