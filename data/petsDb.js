const mysql = require("mysql");
const { query } = require("./db");

const getAllPets = async () => {
	try {
		const queryResult = await query(`SELECT * FROM pets;`);
		return queryResult;
	} catch (err) {
		return err;
	}
};
exports.getAllPets = getAllPets;
