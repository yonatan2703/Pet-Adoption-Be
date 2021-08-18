const { validationMid } = require("./validation.js");
const S = require("fluent-json-schema");

const petSchema = S.object()
	.prop("type", S.string().required())
	.prop("name", S.string().minLength(2).required())
	.prop("adoption_status", S.string().required())
	.prop("height", S.number().minimum(5).maximum(160).required())
	.prop("weight", S.number().minimum(5).maximum(100).required())
	.prop("color", S.string().required())
	.prop("bio", S.string().required())
	.prop("dietary_restrictions", S.string().required())
	.prop("hypoallergenic", S.boolean().required())
	.prop("breed", S.string().required())
	.valueOf();
const addPetValidation = () => validationMid(petSchema);
exports.addPetValidation = addPetValidation;

const adoptFosterSchema = S.object()
	.prop("ownerId", S.number().required())
	.prop("adoption_status", S.string().required())
	.valueOf();
const adoptFosterPetValidation = () => validationMid(adoptFosterSchema);
exports.adoptFosterPetValidation = adoptFosterPetValidation;
