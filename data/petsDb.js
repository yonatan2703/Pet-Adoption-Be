const { query } = require("./db");

const getPets = async (params) => {
	let whereQuery;
	// checking if params is empty
	if (Object.keys(params).length !== 0) {
		whereQuery = "WHERE ";
		if (params.type) {
			if (whereQuery !== "WHERE ") whereQuery += " AND ";
			whereQuery += `type = "${params.type}"`;
		}
		if (params.adoptionStatus) {
			if (whereQuery !== "WHERE ") whereQuery += " AND ";
			whereQuery += `adoption_status = "${params.adoptionStatus}"`;
		}
		if (params.name) {
			if (whereQuery !== "WHERE ") whereQuery += " AND ";
			whereQuery += `name = "${params.name}"`;
		}
		if (params.minHeight) {
			if (whereQuery !== "WHERE ") whereQuery += " AND ";
			whereQuery += `height >= ${params.minHeight}`;
		}
		if (params.maxHeight) {
			if (whereQuery !== "WHERE ") whereQuery += " AND ";
			whereQuery += `height <= ${params.maxHeight}`;
		}
		if (params.minWeight) {
			if (whereQuery !== "WHERE ") whereQuery += " AND ";
			whereQuery += `weight >= ${params.minWeight}`;
		}
		if (params.maxWeight) {
			if (whereQuery !== "WHERE ") whereQuery += " AND ";
			whereQuery += `weight <= ${params.maxWeight}`;
		}
	}
	try {
		const queryResult = await query(`SELECT * FROM pets ${whereQuery};`);
		return queryResult;
	} catch (err) {
		return err;
	}
};
exports.getPets = getPets;

const addPet = async (pet) => {
	const {
		type,
		name,
		adoptionStatus,
		height,
		weight,
		color,
		imageUrl,
		imageAlt,
		bio,
		dietaryRestrictions,
		hypoallergenic,
		breed,
	} = pet;
	try {
		const queryResult = await query(
			`INSERT INTO pets (type, name, adoption_status, height, weight, color, bio, hypoallergenic, dietary_restrictions, breed, owner_id, image_url, image_alt) VALUES ("${type}", "${name}", "${adoptionStatus}", ${height}, ${weight}, "${color}", "${bio}", ${hypoallergenic}, "${dietaryRestrictions}", "${breed}", null, "${imageUrl}", "${imageAlt}");`
		);
		return { result: queryResult, message: "pet added" };
	} catch (err) {
		return err;
	}
};
exports.addPet = addPet;

const getPetById = async (id) => {
	try {
		const queryResult = await query(
			`SELECT * FROM pets WHERE pet_id = ${id};`
		);
		if (queryResult.length === 1)
			return {
				ok: true,
				result: queryResult[0],
			};
		return {
			ok: false,
			message: "pet not found in database",
		};
	} catch (err) {
		return err;
	}
};
exports.getPetById = getPetById;

const editPetById = async (id, pet) => {
	const {
		type,
		name,
		adoptionStatus,
		height,
		weight,
		color,
		imageUrl,
		imageAlt,
		bio,
		dietaryRestrictions,
		hypoallergenic,
		breed,
	} = pet;
	try {
		let queryResult;
		if (imageUrl) {
			queryResult = await query(
				`UPDATE pets SET type = "${type}", name = "${name}", adoption_status = "${adoptionStatus}", height = ${height}, weight = ${weight}, color = "${color}", bio = "${bio}", hypoallergenic = ${hypoallergenic}, dietary_restrictions = "${dietaryRestrictions}", breed = "${breed}", image_url = "${imageUrl}", image_alt = "${imageAlt}" WHERE pet_id = ${id};`
			);
		} else {
			queryResult = await query(
				`UPDATE pets SET type = "${type}", name = "${name}", adoption_status = "${adoptionStatus}", height = ${height}, weight = ${weight}, color = "${color}", bio = "${bio}", hypoallergenic = ${hypoallergenic}, dietary_restrictions = "${dietaryRestrictions}", breed = "${breed}",  image_alt = "${imageAlt}" WHERE pet_id = ${id};`
			);
		}
		return { result: queryResult, message: "pet updated" };
	} catch (err) {
		return err;
	}
};
exports.editPetById = editPetById;
