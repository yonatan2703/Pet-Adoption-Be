const { query, SQL } = require("./db");

const getPets = async (params) => {
	const updates = [];
	// checking if params is empty
	if (Object.keys(params).length !== 0) {
		if (params.type) {
			if (updates.length === 0)
				updates.push(SQL`WHERE type = ${params.type}`);
			updates.push(SQL`type = ${params.type}`);
		}
		if (params.adoptionStatus) {
			if (updates.length === 0)
				updates.push(
					SQL`WHERE adoption_status = ${params.adoptionStatus}`
				);
			updates.push(SQL`adoption_status = ${params.adoptionStatus}`);
		}
		if (params.name) {
			if (updates.length === 0)
				updates.push(SQL`WHERE name = ${params.name}`);
			updates.push(SQL`name = ${params.name}`);
		}
		if (params.minHeight) {
			if (updates.length === 0)
				updates.push(SQL`WHERE height >= ${+params.minHeight}`);
			updates.push(SQL`height >= ${+params.minHeight}`);
		}
		if (params.maxHeight) {
			if (updates.length === 0)
				updates.push(SQL`WHERE height <= ${+params.maxHeight}`);
			updates.push(SQL`height <= ${+params.maxHeight}`);
		}
		if (params.minWeight) {
			if (updates.length === 0)
				updates.push(SQL`WHERE weight >= ${+params.minWeight}`);
			whereQuery += `weight >= ${+params.minWeight}`;
		}
		if (params.maxWeight) {
			if (updates.length === 0)
				updates.push(SQL`WHERE weight <= ${+params.maxWeight}`);
			updates.push(SQL`weight <= ${+params.maxWeight}`);
		}
	}
	try {
		const queryResult = await query(
			SQL`SELECT * FROM pets ${SQL.glue(updates, " AND ")};`
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
			SQL`INSERT INTO pets (type, name, adoption_status, height, weight, color, bio, hypoallergenic, dietary_restrictions, breed, owner_id, image_url, image_alt) VALUES (${type}, ${name}, ${adoptionStatus}, ${+height}, ${+weight}, ${color}, ${bio}, ${hypoallergenic}, ${dietaryRestrictions}, ${breed}, null, ${imageUrl}, ${imageAlt});`
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
		const updates = [];
		if (imageUrl) updates.push(SQL`image_url = ${imageUrl},`);
		const queryResult = await query(
			SQL`UPDATE pets SET type = "${type}", name = "${name}", adoption_status = "${adoptionStatus}", height = ${+height}, weight = ${+weight}, color = "${color}", bio = "${bio}", hypoallergenic = ${hypoallergenic}, dietary_restrictions = "${dietaryRestrictions}", breed = "${breed}", ${SQL.glue(
				updates,
				" , "
			)} image_alt = "${imageAlt}" WHERE pet_id = ${+id};`
		);

		return { result: queryResult, message: "pet updated" };
	} catch (err) {
		return err;
	}
};
exports.editPetById = editPetById;

const adoptFosterPet = async (id, req) => {
	const { ownerId, adoptionStatus } = req;
	try {
		const queryResult = await query(
			SQL`SELECT adoption_status FROM pets WHERE pet_id = ${+id};`
		);
		if (queryResult[0].adoption_status === "adopted")
			return { result: queryResult, message: `pet already adopted` };
	} catch (err) {
		return err;
	}
	try {
		const queryResult = await query(
			SQL`UPDATE pets SET owner_id = ${ownerId}, adoption_status = ${adoptionStatus} WHERE pet_id = ${id};`
		);

		return { result: queryResult, message: `pet ${adoptionStatus}` };
	} catch (err) {
		return err;
	}
};
exports.adoptFosterPet = adoptFosterPet;
