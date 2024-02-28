function CustomError (message, code) {
    this.statusCode = code;
    this.message = message;
    this.stack = (new Error()).stack;
}
CustomError.prototype = new Error;  // <-- remove this if you do not 

module.exports = { CustomError }