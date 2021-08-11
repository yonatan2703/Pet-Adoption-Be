const mysql = require("mysql");
const SQL = require("@nearform/sql");
exports.SQL = SQL;

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "27031997",
	database: "petShop",
});

db.connect((err) => {
	if (err) throw err;
	console.log("mysql connected");
});

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
			`CREATE TABLE users(user_id int AUTO_INCREMENT, email VARCHAR(255), password VARCHAR(255), first_name VARCHAR(50), last_name VARCHAR(255), phone VARCHAR(12), bio VARCHAR(400), role VARCHAR(12), PRIMARY KEY (user_id));`
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
