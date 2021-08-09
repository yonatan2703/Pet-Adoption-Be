const express = require("express");
const router = express.Router();
const { validationMid } = require("../middlewares/validation.js");
const S = require("fluent-json-schema");
const { addUser, query, loginUser } = require("../data/db");

// sign up
const signUpSchema = S.object()
	.prop("email", S.string().required())
	.prop("password", S.string().minLength(8).required())
	.prop("passwordValidation", S.string().minLength(8).required())
	.prop("fName", S.string().required())
	.prop("lName", S.string().required())
	.prop("phone", S.string().minLength(9).maxLength(11).required())
	.valueOf();

router.post("/signup", validationMid(signUpSchema), async (req, res, next) => {
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
const loginSchema = S.object()
	.prop("email", S.string().required())
	.prop("password", S.string().minLength(8).required())
	.valueOf();

router.post("/login", validationMid(loginSchema), async (req, res, next) => {
	const { password, email } = req.body;
	try {
		const logged = await loginUser(email, password);
		res.send(logged);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
