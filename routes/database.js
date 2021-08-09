const express = require("express");
const router = express.Router();
const {
	createDb,
	createPetsTable,
	createUsersTable,
	createSavedPetsTable,
} = require("../data/db");

// Create a petShop db
router.get("/createDb", async (req, res, next) => {
	try {
		const result = await createDb("petShop");
		res.send(result);
	} catch (err) {
		res.send(err);
	}
});

// Create a pets table
router.get("/createPetsTable", async (req, res, next) => {
	try {
		const result = await createPetsTable();
		res.send(result);
	} catch (err) {
		res.send(err);
	}
});

// Create a users table
router.get("/createUsersTable", async (req, res, next) => {
	try {
		const result = await createUsersTable();
		res.send(result);
	} catch (err) {
		res.send(err);
	}
});

// Create a saved_pets table
router.get("/createSavedPetsTable", async (req, res, next) => {
	try {
		const result = await createSavedPetsTable();
		res.send(result);
	} catch (err) {
		res.send(err);
	}
});

module.exports = router;
