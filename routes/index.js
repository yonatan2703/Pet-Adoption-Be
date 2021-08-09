const express = require("express");
const router = express.Router();
const {
	signUpValidation,
	loginValidation,
} = require("../middlewares/usersValidation.js");
const { addUser, query, loginUser } = require("../data/db");

// sign up
router.post("/signup", signUpValidation(), async (req, res, next) => {
	const { password, passwordValidation, email } = req.body;
	if (password !== passwordValidation) {
		res.send("Passwords don't match");
		return;
	}
	try {
		const emailCheck = await query(
			`SELECT email FROM users WHERE email = "${email}";`
		);
		if (emailCheck.length) {
			res.send("email already taken");
			return;
		}
		try {
			const queryResult = await addUser(req.body);
			console.log(queryResult);
			res.send(queryResult);
		} catch (err) {
			next(err);
		}
	} catch (err) {
		next(err);
	}
});

// login
router.post("/login", loginValidation(), async (req, res, next) => {
	const { password, email } = req.body;
	try {
		const logged = await loginUser(email, password);
		res.send(logged);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
