const { query, SQL } = require("./db");

const getPets = async (params) => {
	const updates = [];
	const where = [];
	// checking if params is empty
	if (Object.keys(params).length !== 0) {
		where.push(SQL`WHERE `);
		if (params.type) {
			updates.push(SQL`type = ${params.type}`);
		}
		if (params.adoption_status) {
			updates.push(SQL`adoption_status = ${params.adoption_status}`);
		}
		if (params.name) {
			updates.push(SQL`name LIKE ${"%" + params.name + "%"}`);
		}
		if (params.minHeight) {
			updates.push(SQL`height >= ${+params.minHeight}`);
		}
		if (params.maxHeight) {
			updates.push(SQL`height <= ${+params.maxHeight}`);
		}
		if (params.minWeight) {
			updates.push(SQL`weight >= ${+params.minWeight}`);
		}
		if (params.maxWeight) {
			updates.push(SQL`weight <= ${+params.maxWeight}`);
		}
	}
	try {
		const queryResult = await query(
			SQL`SELECT * FROM pets ${SQL.glue(where)} ${SQL.glue(
				updates,
				" AND "
			)};`
		);
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
		adoption_status,
		height,
		weight,
		color,
		bio,
		dietary_restrictions,
		hypoallergenic,
		breed,
	} = pet;
	try {
		const queryResult = await query(
			SQL`INSERT INTO pets (type, name, adoption_status, height, weight, color, bio, hypoallergenic, dietary_restrictions, breed, owner_id, image_alt) VALUES (${type}, ${name}, ${adoption_status}, ${+height}, ${+weight}, ${color}, ${bio}, ${hypoallergenic}, ${dietary_restrictions}, ${breed}, null, "No pet picture found");`
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
			SQL`SELECT * FROM pets WHERE pet_id = ${+id};`
		);
		if (queryResult.length === 1)
			return {
				ok: true,
				pet: queryResult[0],
			};
		throw {
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
		adoption_status,
		height,
		weight,
		color,
		bio,
		dietary_restrictions,
		hypoallergenic,
		breed,
	} = pet;
	try {
		const queryResult = await query(
			SQL`UPDATE pets SET type = ${type}, name = ${name}, adoption_status = ${adoption_status}, height = ${+height}, weight = ${+weight}, color = ${color}, bio = ${bio}, hypoallergenic = ${hypoallergenic}, dietary_restrictions = ${dietary_restrictions}, breed = ${breed}, image_alt = "No pet picture found" WHERE pet_id = ${+id};`
		);

		return { result: queryResult, message: "pet updated" };
	} catch (err) {
		return err;
	}
};
exports.editPetById = editPetById;

const adoptFosterPet = async (id, req, userId) => {
	const { adoption_status } = req;
	try {
		const queryResult = await query(
			SQL`SELECT adoption_status FROM pets WHERE pet_id = ${+id};`
		);
		if (queryResult[0].adoption_status === "adopted")
			throw { result: queryResult, message: `pet already adopted` };
	} catch (err) {
		return err;
	}
	try {
		const queryResult = await query(
			SQL`UPDATE pets SET owner_id = ${userId}, adoption_status = ${adoption_status} WHERE pet_id = ${id};`
		);

		return { result: queryResult, message: `pet ${adoption_status}` };
	} catch (err) {
		return err;
	}
};
exports.adoptFosterPet = adoptFosterPet;

const returnPet = async (id) => {
	try {
		const queryResult = await query(
			SQL`UPDATE pets SET owner_id = null, adoption_status = "available" WHERE pet_id = ${id};`
		);

		return { result: queryResult, message: `pet was returned to shop` };
	} catch (err) {
		return err;
	}
};
exports.returnPet = returnPet;

const savePet = async (userId, petId) => {
	try {
		const queryResult = await query(
			SQL`INSERT INTO saved_pets (owner_id, pet_id) VALUES (${+userId}, ${+petId});`
		);

		return { result: queryResult, message: `pet was saved` };
	} catch (err) {
		return err;
	}
};
exports.savePet = savePet;

const removedSavedPet = async (userId, petId) => {
	try {
		const queryResult = await query(
			SQL`DELETE FROM saved_pets WHERE owner_id = ${+userId} AND pet_id = ${+petId};`
		);

		return {
			result: queryResult,
			message: `pet was removed from saved pets`,
		};
	} catch (err) {
		return err;
	}
};
exports.removedSavedPet = removedSavedPet;

const uploadPetPic = async (id, imageUrl) => {
	try {
		const queryResult = await query(
			SQL`UPDATE pets SET image_url = ${imageUrl} WHERE pet_id = ${id};`
		);

		return { result: imageUrl, message: `pet image was updated` };
	} catch (err) {
		return err;
	}
};
exports.uploadPetPic = uploadPetPic;

const getUsersPets = async (id) => {
	try {
		const ownedPets = await query(
			SQL`SELECT * FROM pets WHERE owner_id = ${id};`
		);
		const savedPets = await query(
			SQL`SELECT * FROM pets WHERE pet_id IN (SELECT pet_id FROM saved_pets WHERE owner_id = ${id});`
		);

		return {
			ownedPets: ownedPets,
			savedPets: savedPets,
			message: `saved and owned pets`,
		};
	} catch (err) {
		return err;
	}
};
exports.getUsersPets = getUsersPets;
