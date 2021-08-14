const express = require("express");
const router = express.Router();
const { validationMid } = require("../middlewares/validation.js");
const S = require("fluent-json-schema");
const { getAllUsers, makeAdmin } = require("../data/usersDb");
const { authenticate } = require("../middlewares/authentication");
const { adminCheck } = require("../middlewares/adminCheck");
const { urlFromCloudinary } = require("../middlewares/urlFromCloudinary");
const { upload } = require("../lib/uploadFiles");

/* GET users listing. */
router.get("/", authenticate(), adminCheck(), async (req, res, next) => {
	try {
		const usersList = await getAllUsers();
		console.log(usersList);
		res.send(usersList);
	} catch (error) {
		next(error);
	}
});

router.put(
	"/makeAdmin",
	authenticate(),
	adminCheck(),
	async (req, res, next) => {
		try {
			const adminUser = await makeAdmin(req.body.userId);
			res.send(adminUser);
		} catch (error) {
			next(error);
		}
	}
);

router.post(
	"/profilePic",
	authenticate(),
	adminCheck(),
	upload.single("img"),
	urlFromCloudinary(),
	async (req, res, next) => {
		const img = req.body.imageUrl;
		res.send({ img });
	}
);

module.exports = router;
