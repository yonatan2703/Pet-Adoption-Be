const fs = require("fs");
const { uploadToCloudinary } = require("../lib/cloudinary");

const urlFromCloudinary = () => {
	return async (req, res, next) => {
		try {
			const result = await uploadToCloudinary(req.file.path);
			fs.unlinkSync(req.file.path); // remove file from disk
			const fileUrl = result.secure_url;
			req.body.imageUrl = fileUrl;
			next();
		} catch (err) {
			res.status(400).send({ message: "need image to upload" });
		}
	};
};
exports.urlFromCloudinary = urlFromCloudinary;
