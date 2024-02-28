const mysql = require("mysql")
const validateMysql = (id) => {
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    const isValid = regexExp.test(id)
    if (!isValid){
        throw new CustomError("Id not valid or not found", 404)
    }
}
module.exports = {validateMysql}