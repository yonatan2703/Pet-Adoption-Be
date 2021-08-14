const cloudinary = require("cloudinary").v2;
cloudinary.config({
	cloud_name: "dtt1ugwho",
	api_key: "225438119542858",
	api_secret: "hITyvPlLISIukC47wuHKnCjEdx4",
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
