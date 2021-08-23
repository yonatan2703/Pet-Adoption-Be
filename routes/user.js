const express = require("express");
const router = express.Router();
const { updateUserValidation } = require("../middlewares/usersValidation.js");
const {
	getAllUsers,
	makeAdmin,
	getUserById,
	unAdmin,
	updateUser,
} = require("../data/usersDb");
const { getUsersPets } = require("../data/petsDb");
const { authenticate } = require("../middlewares/authentication");
const { adminCheck } = require("../middlewares/adminCheck");
const { urlFromCloudinary } = require("../middlewares/urlFromCloudinary");
const { upload } = require("../lib/uploadFiles");

// get all users
router.get("/", authenticate(), adminCheck(), async (req, res, next) => {
	try {
		const usersList = await getAllUsers();
		res.send(usersList);
	} catch (error) {
		next(error);
	}
});

// make a user into an admin
router.put(
	"/makeAdmin/:id",
	authenticate(),
	adminCheck(),
	async (req, res, next) => {
		try {
			const { id } = req.params;
			const adminUser = await makeAdmin(id);
			res.send(adminUser);
		} catch (error) {
			next(error);
		}
	}
);

// remove user from admins
router.put(
	"/unAdmin/:id",
	authenticate(),
	adminCheck(),
	async (req, res, next) => {
		try {
			const { id } = req.params;
			const adminUser = await unAdmin(id);
			res.send(adminUser);
		} catch (error) {
			next(error);
		}
	}
);

// get a user by id
router.get("/:id", authenticate(), adminCheck(), async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await getUserById(id);
		res.send(result);
	} catch (error) {
		next(error);
	}
});

// get a user
router.get("/", authenticate(), async (req, res, next) => {
	try {
		const { userId } = req.decoded;
		const result = await getUserById(userId);
		res.send(result);
	} catch (error) {
		next(error);
	}
});

// update user by id
router.put(
	"/:id",
	updateUserValidation(),
	authenticate(),
	adminCheck(),
	async (req, res, next) => {
		try {
			const { id } = req.params;
			const result = await updateUser(id, req.body);
			res.send(result);
		} catch (error) {
			next(error);
		}
	}
);

// update user
router.put(
	"/",
	updateUserValidation(),
	authenticate(),
	async (req, res, next) => {
		try {
			const { userId } = req.decoded;
			const result = await updateUser(userId, req.body);
			res.send(result);
		} catch (error) {
			next(error);
		}
	}
);

// get a user full details by id
router.get(
	"/:id/full",
	authenticate(),
	adminCheck(),
	async (req, res, next) => {
		try {
			const { id } = req.params;
			const userData = await getUserById(id);
			const userPets = await getUsersPets(id);
			res.send({ userData, userPets });
		} catch (error) {
			next(error);
		}
	}
);

// get a user full details
router.get("/full", authenticate(), async (req, res, next) => {
	try {
		const { userId } = req.decoded;
		const userData = await getUserById(userId);
		const userPets = await getUsersPets(userId);
		res.send({ userData, userPets });
	} catch (error) {
		next(error);
	}
});
module.exports = router;
