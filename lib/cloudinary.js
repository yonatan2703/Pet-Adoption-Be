const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: process.env.IMG_DB_NAME,
	api_key: process.env.IMG_DB_KEY,
	api_secret: process.env.IMG_DB_SECRET,
});

function uploadToCloudinary(filePath) {
	return new Promise((resolve, reject) => {
		cloudinary.uploader.upload(filePath, function (error, result) {
			if (error) reject(error);
			else resolve(result);
		});
	});
}
exports.uploadToCloudinary = uploadToCloudinary;
