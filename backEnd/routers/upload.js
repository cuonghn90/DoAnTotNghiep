const express = require('express');
const router = express.Router()
const { uploadFile } = require('../utils/Cloudinary');
const { CustomError } = require('../utils/CustomError');
const { uploadExcel } = require('../controller/uploadController');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post("/uploadImage", (req, res) => {
    uploadFile(req.body.image)
        .then((url) => res.send(url))
        .catch((err) => {res.status(400).json(err)});
});
router.post('/uploadExcel', upload.single("fileName"), uploadExcel)
module.exports = router;