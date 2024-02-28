var cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadFile = async (file) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file, (err,result) => {
            if (result && result.secure_url) {
                return resolve(result.secure_url);
            }
            return reject(err);
        });
    });
};
const deleteFile = async (file) => {
    return new Promise((resolve) => {
        cloudinary.uploader.destroy(file, (result) => {
            resolve(
                {
                    url: result.secure_url,
                    asset_id: result.asset_id,
                    public_id: result.public_id,
                },
                {
                    resource_type: "auto",
                }
            );
        });
    });
};

module.exports = { uploadFile, deleteFile };