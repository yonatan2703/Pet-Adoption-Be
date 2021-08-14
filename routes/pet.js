const express = require("express");
const router = express.Router();
const {
	addPetValidation,
	adoptFosterPetValidation,
} = require("../middlewares/petsValidation.js");
const { authenticate } = require("../middlewares/authentication");
const { adminCheck } = require("../middlewares/adminCheck");
const {
	getPets,
	addPet,
	getPetById,
	editPetById,
	adoptFosterPet,
	savePet,
	returnPet,
	removedSavedPet,
} = require("../data/petsDb");
const fs = require("fs");
const { upload } = require("../lib/uploadFiles");

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
router.post(
	"/",
	authenticate(),
	adminCheck(),
	addPetValidation(),
	async (req, res, next) => {
		const { userId } = req.decoded;
		try {
			const result = await addPet(req.body, userId);
			res.send(result);
		} catch (error) {
			next(error);
		}
	}
);

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
router.put("/:id", authenticate(), adminCheck(), async (req, res, next) => {
	const { id } = req.params;
	const { userId } = req.decoded;
	try {
		const petResult = await editPetById(id, req.body, userId);
		res.send(petResult);
	} catch (error) {
		next(error);
	}
});

// adopt/foster pet
router.post(
	"/:id/adopt",
	authenticate(),
	adoptFosterPetValidation(),
	async (req, res, next) => {
		const { id } = req.params;
		try {
			const result = await adoptFosterPet(id, req.body);
			res.send(result);
		} catch (error) {
			next(error);
		}
	}
);

// return pet
router.post("/:id/return", authenticate(), async (req, res, next) => {
	const { id } = req.params;
	try {
		const result = await returnPet(id);
		res.send(result);
	} catch (error) {
		next(error);
	}
});

// save pet
router.post("/:id/save", authenticate(), async (req, res, next) => {
	const { id } = req.params;
	const { userId } = req.decoded;
	try {
		const result = await savePet(userId, id);
		res.send(result);
	} catch (error) {
		next(error);
	}
});

// remove saved pet
router.delete("/:id/save", authenticate(), async (req, res, next) => {
	const { id } = req.params;
	const { userId } = req.decoded;
	try {
		const result = await removedSavedPet(userId, id);
		res.send(result);
	} catch (error) {
		next(error);
	}
});

module.exports = router;