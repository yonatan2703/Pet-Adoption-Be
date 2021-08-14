const express = require("express");
const router = express.Router();
const {
	signUpValidation,
	loginValidation,
} = require("../middlewares/usersValidation.js");
const { query, SQL } = require("../data/db");
const { addUser, loginUser } = require("../data/usersDb");
const { authenticate } = require("../middlewares/authentication");

// sign up
router.post("/signup", signUpValidation(), async (req, res, next) => {
	const { password, passwordValidation, email } = req.body;
	if (password !== passwordValidation) {
		res.send("Passwords don't match");
		return;
	}
	try {
		const emailCheck = await query(
			SQL`SELECT email FROM users WHERE email = ${email};`
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
	const { email, password } = req.body;
	try {
		const result = await loginUser(email, password);
		res.set("token", result.token);
		res.send(result);
	} catch (err) {
		next(err);
	}
});

router.get("/login", authenticate(), async (req, res, next) => {
	try {
		const [user] = await query(
			SQL`SELECT * FROM users WHERE user_id = ${+req.decoded.userId};`
		);
		res.send({
			logged: true,
			message: "you have logged in",
			data: user,
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
