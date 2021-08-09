const bcrypt = require("bcrypt");
const { query } = require("./db");

const getAllUsers = async () => {
	try {
		const queryResult = await query(`SELECT * FROM users;`);
		return queryResult;
	} catch (err) {
		return err;
	}
};
exports.getAllUsers = getAllUsers;

const addUser = async (user) => {
	const { email, password, fName, lName, phone } = user;
	return new Promise(async (resolve, reject) => {
		bcrypt.genSalt(11, (err, salt) => {
			if (err) reject(err);
			bcrypt.hash(password, salt, async (err, hash) => {
				if (err) reject(err);
				try {
					const queryResult = await query(
						`INSERT INTO users (email, password, first_name, last_name, phone, bio) VALUES ("${email}", "${hash}", "${fName}", "${lName}", "${phone}", null);`
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
			const hashedPass = await query(
				`SELECT password FROM users WHERE email = "${email}";`
			);
			if (hashedPass.length === 0)
				resolve({ result: false, message: "wrong password or email" });
			bcrypt.compare(password, hashedPass[0].password, (err, result) => {
				if (err) {
					reject(err);
				} else {
					if (result)
						resolve({
							result: result,
							message: "you have logged in",
						});
					resolve({
						result: result,
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
