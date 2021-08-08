const express = require("express");
const router = express.Router();
const { validationMid } = require("../middlewares/validation.js");
const S = require("fluent-json-schema");
const { getAllPets } = require("../data/db");

/* GET pets listing. */
router.get("/", async (req, res, next) => {
	try {
		const petsList = await getAllPets();
		res.send(petsList);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
