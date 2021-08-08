const express = require("express");
const router = express.Router();
const { validationMid } = require("../middlewares/validation.js");
const S = require("fluent-json-schema");
const { getAllUsers } = require("../data/db");

/* GET users listing. */
router.get("/", async (req, res, next) => {
	try {
		const usersList = await getAllUsers();
		res.send(usersList);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
