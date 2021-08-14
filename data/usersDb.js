const bcrypt = require("bcrypt");
const { query, SQL } = require("./db");
const { sign } = require("../lib/auth");

const getAllUsers = async () => {
	try {
		const queryResult = await query(
			SQL`SELECT user_id, email, first_name, last_name, phone, bio, role FROM users;`
		);
		return queryResult;
	} catch (err) {
		return err;
	}
};
exports.getAllUsers = getAllUsers;

const addUser = (user) => {
	const { email, password, fName, lName, phone } = user;
	return new Promise(async (resolve, reject) => {
		bcrypt.genSalt(11, (err, salt) => {
			if (err) reject(err);
			bcrypt.hash(password, salt, async (err, hash) => {
				if (err) reject(err);
				try {
					const queryResult = await query(
						SQL`INSERT INTO users (email, password, first_name, last_name, phone, bio, role) VALUES (${email}, ${hash}, ${fName}, ${lName}, ${phone}, null, "user");`
					);
					resolve({
						result: queryResult,
						message: "signed up to the site",
					});
				} catch (err) {
					reject(err);
				}
			});
		});
	});
};
exports.addUser = addUser;

const loginUser = (email, password) => {
	return new Promise(async (resolve, reject) => {
		try {
			const [user] = await query(
				SQL`SELECT * FROM users WHERE email = ${email};`
			);
			if (!user)
				resolve({ logged: false, message: "wrong password or email" });
			bcrypt.compare(password, user.password, (err, logged) => {
				if (err) {
					reject(err);
				} else {
					if (logged) {
						const { password, ...rest } = user;
						resolve({
							logged: true,
							message: "you have logged in",
							token: sign({ userId: user.user_id }),
							data: rest,
						});
					}
					resolve({
						logged: false,
						message: "wrong password or email",
					});
				}
			});
		} catch (err) {
			reject(err);
		}
	});
};
exports.loginUser = loginUser;

const makeAdmin = async (userId) => {
	try {
		const queryResult = await query(
			SQL`UPDATE users SET role = "admin" WHERE user_id = ${userId};`
		);
		return {
			result: queryResult,
			message: "user is now admin",
		};
	} catch (err) {
		return err;
	}
};
exports.makeAdmin = makeAdmin;
