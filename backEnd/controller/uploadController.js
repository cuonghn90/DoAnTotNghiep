const xlsx = require("xlsx");
const asyncHandler = require("express-async-handler");
const { checkIsCategory } = require("./categoryController");
const { productMapToDb } = require("../models/productModel");
const { checkProductExist, createProductFromExcel } = require("./productController");


const uploadExcel = asyncHandler(async(req, res)=>{
    try {
        let path = req.file.path;
        var workbook = xlsx.readFile(path);
        var sheet_name_list = workbook.SheetNames;

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const options = { header: 1 };
        const sheetData2 = xlsx.utils.sheet_to_json(worksheet, options);
        const header = sheetData2.shift();

        let jsonData = xlsx.utils.sheet_to_json(
            workbook.Sheets[sheet_name_list[0]]
        );

        let error = {}

        if (jsonData.length === 0) {
            error.status = 400
            error.message = "không có dữ liệu để import!"
            throw error
        }
        if (header.length !== Object.keys(productMapToDb).length){
            error.status = 400
            error.message = "Dữ liệu header không hợp lệ!"
            throw error
        }

        const headerArray = Array.from(header)

        for (const col of Object.getOwnPropertyNames(productMapToDb)) {
            const headerNameTemplate = headerArray.includes(col)
            if (!headerNameTemplate){
                error.status = 400
                error.message = "Cột dữ liệu header không hợp lệ!"
                throw error
            }
        }
        const listProductFromExcel = []
        for(let row = 0; row < jsonData.length ; row++){
            const newProduct = {}
            for(let col = 0 ; col < headerArray.length ; col++){
                
                const importColumnTemplate = (headerArray[col] in productMapToDb) ? productMapToDb[headerArray[col]] : null
                if (importColumnTemplate == null) {
                    continue;
                }
                let dataType = importColumnTemplate.dataType ? importColumnTemplate.dataType : "String"
                let cellValue = jsonData[row][`${headerArray[col]}`]
                if(importColumnTemplate.isRequire && !cellValue){
                    error.status = 400
                    error.message = `Dữ liệu ${headerArray[col]} không được bỏ trống, Vui lòng xem lại.`
                    throw error
                }
                switch(dataType){
                    case "Interger":
                        cellValue = parseInt(cellValue)
                        if(isNaN(cellValue)){
                            error.status = 400
                            error.message = 'Dữ liệu đầu vào không hợp lê, Vui lòng xem lại.'
                            throw error
                        }
                        break;
                    case "String":
                        if(cellValue == undefined){
                            cellValue = ''
                        }
                        cellValue = String(cellValue)
                        break;
                    default:
                        break;
                }
                if(headerArray[col] == 'categoryId'){
                    if (!(await checkIsCategory(cellValue))){
                        error.status = 400
                        error.message = `Không có ${cellValue} trong danh mục, Vui lòng xem lại.`
                        throw error
                    }
                }
                newProduct[`${headerArray[col]}`] = cellValue
            }
            listProductFromExcel.push(newProduct)
        }
        let count = 0
        for(const product of listProductFromExcel){
            if(!(await checkProductExist(product.name))){
                count += 1
                await createProductFromExcel(product)
            }
        }
        const response = {
            status: 201,
            message: count > 0 ? `Thêm thành công ${count} bản ghi` : `Không có bản ghi nào được thêm.`
        }
        return res.status(201).json(response);
    } catch (err) {
        return res.status(err.status ? err.status : 500).json({ success: false, message: err.message });
    }
})


module.exports = { uploadExcel }