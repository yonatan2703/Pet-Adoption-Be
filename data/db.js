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
	} catch (err) {
		return err;
	}
};
exports.createDb = createDb;

const createPetsTable = async () => {
	try {
		const queryResult = await query(
			`CREATE TABLE pets(pet_id int AUTO_INCREMENT, type VARCHAR(50), name VARCHAR(255), adoption_status VARCHAR(50), height int, weight int, color VARCHAR(255), bio VARCHAR(400), hypoallergenic BOOLEAN, dietary_restrictions VARCHAR(255), breed VARCHAR(255), owner_id int, image_url VARCHAR(255),  image_alt VARCHAR(255), PRIMARY KEY (pet_id));`
		);
		return queryResult;
	} catch (err) {
		return err;
	}
};
exports.createPetsTable = createPetsTable;

const createUsersTable = async () => {
	try {
		const queryResult = await query(
			`CREATE TABLE users(user_id int AUTO_INCREMENT, email VARCHAR(255), password VARCHAR(255), first_name VARCHAR(50), last_name VARCHAR(255), phone VARCHAR(12), bio VARCHAR(400), PRIMARY KEY (user_id));`
		);
		return queryResult;
	} catch (err) {
		return err;
	}
};
exports.createUsersTable = createUsersTable;

const createSavedPetsTable = async () => {
	try {
		const queryResult = await query(
			`CREATE TABLE saved_pets(id int AUTO_INCREMENT, owner_id int, pet_id int, PRIMARY KEY (id));`
		);
		return queryResult;
	} catch (err) {
		return err;
	}
};
exports.createSavedPetsTable = createSavedPetsTable;

const getAllPets = async () => {
	try {
		const queryResult = await query(`SELECT * FROM pets;`);
		return queryResult;
	} catch (err) {
		return err;
	}
};
exports.getAllPets = getAllPets;

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
