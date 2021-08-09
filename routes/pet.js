const express = require("express");
const router = express.Router();
const { addPetValidation } = require("../middlewares/petsValidation.js");
const S = require("fluent-json-schema");
const { getPets, addPet, getPetById, editPetById } = require("../data/petsDb");

/* GET pets listing. */
router.get("/", async (req, res, next) => {
	try {
		const petsList = await getPets(req.query);
		res.send(petsList);
	} catch (error) {
		next(error);
	}
});

// add pet
router.post("/", addPetValidation(), async (req, res, next) => {
	try {
		const result = await addPet(req.body);
		res.send(result);
	} catch (error) {
		next(error);
	}
});

// get pet by id
router.get("/:id", async (req, res, next) => {
	const { id } = req.params;
	try {
		const petResult = await getPetById(id);
		res.send(petResult);
	} catch (error) {
		next(error);
	}
});

// edit pet
router.put("/:id", async (req, res, next) => {
	const { id } = req.params;
	try {
		const petResult = await editPetById(id, req.body);
		res.send(petResult);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
