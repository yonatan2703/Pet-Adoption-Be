const { validationMid } = require("./validation.js");
const S = require("fluent-json-schema");

const signUpSchema = S.object()
	.prop("email", S.string().format(S.FORMATS.EMAIL).minLength(6).required())
	.prop("password", S.string().minLength(8).required())
	.prop("passwordValidation", S.string().minLength(8).required())
	.prop("fName", S.string().minLength(2).required())
	.prop("lName", S.string().minLength(2).required())
	.prop("phone", S.string().minLength(9).maxLength(11).required())
	.valueOf();
const signUpValidation = () => validationMid(signUpSchema);
exports.signUpValidation = signUpValidation;

const loginSchema = S.object()
	.prop("email", S.string().format(S.FORMATS.EMAIL).minLength(6).required())
	.prop("password", S.string().minLength(8).required())
	.valueOf();
const loginValidation = () => validationMid(loginSchema);
exports.loginValidation = loginValidation;

const updateUserSchema = S.object()
	.prop("email", S.string().format(S.FORMATS.EMAIL).minLength(6).required())
	.prop("fName", S.string().minLength(2).required())
	.prop("lName", S.string().minLength(2).required())
	.prop("phone", S.string().minLength(9).maxLength(11).required())
	.prop("bio", S.string().minLength(1).required())
	.valueOf();
const updateUserValidation = () => validationMid(updateUserSchema);
exports.updateUserValidation = updateUserValidation;
