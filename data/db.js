const mysql = require("mysql");
const bcrypt = require("bcrypt");

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "27031997",
	database: "petShop",
});
exports.db = db;

const query = (queryText) => {
	return new Promise((resolve, reject) => {
		db.query(queryText, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};
exports.query = query;

const createDb = async (dbName) => {
	try {
		const queryResult = await query(`CREATE DATABASE ${dbName}`);
		return queryResult;
	} catch (error) {
		return error;
	}
};
exports.createDb = createDb;

const createPetsTable = async () => {
	try {
		const queryResult = await query(
			`CREATE TABLE pets(pet_id int AUTO_INCREMENT, type VARCHAR(50), name VARCHAR(255), adoption_status VARCHAR(50), height int, weight int, color VARCHAR(255), bio VARCHAR(400), hypoallergenic BOOLEAN, dietary_restrictions VARCHAR(255), breed VARCHAR(255), owner_id int, image_url VARCHAR(255),  image_alt VARCHAR(255), PRIMARY KEY (pet_id));`
		);
		return queryResult;
	} catch (error) {
		return error;
	}
};
exports.createPetsTable = createPetsTable;

const createUsersTable = async () => {
	try {
		const queryResult = await query(
			`CREATE TABLE users(user_id int AUTO_INCREMENT, email VARCHAR(255), password VARCHAR(255), first_name VARCHAR(50), last_name VARCHAR(255), phone VARCHAR(12), bio VARCHAR(400), PRIMARY KEY (user_id));`
		);
		return queryResult;
	} catch (error) {
		return error;
	}
};
exports.createUsersTable = createUsersTable;

const getAllPets = async () => {
	try {
		const queryResult = await query(`SELECT * FROM pets;`);
		return queryResult;
	} catch (error) {
		return error;
	}
};
exports.getAllPets = getAllPets;

const getAllUsers = async () => {
	try {
		const queryResult = await query(`SELECT * FROM users;`);
		return queryResult;
	} catch (error) {
		return error;
	}
};
exports.getAllUsers = getAllUsers;

const addUser = async (user) => {
	const { email, password, fName, lName, phone } = user;
	let hashedPass;
	const a = await bcrypt.genSalt(10, (err, salt) => {
		if (err) return err;
		bcrypt.hash(password, salt, async (err, hash) => {
			if (err) return err;
			try {
				const queryResult = await query(
					`INSERT INTO users (email, password, first_name, last_name, phone, bio) VALUES ("${email}", "${hash}", "${fName}", "${lName}", "${phone}", null);`
				);
				return queryResult;
			} catch (error) {
				return error;
			}
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
				resolve({ logged: false, message: "wrong password or email" });
			bcrypt.compare(password, hashedPass[0].password, (err, result) => {
				if (err) {
					reject(err);
				} else {
					if (result)
						resolve({
							logged: result,
							message: "you have logged in",
						});
					resolve({
						logged: result,
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
