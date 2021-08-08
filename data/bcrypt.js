const bcrypt = require("bcrypt");

const saltRounds = 11;

const hashPassword = (password) => {
	bcrypt.genSalt(saltRounds, (err, salt) => {
		bcrypt.hash(password, salt, (err, hash) => {
			return hash;
		});
	});
};
exports.hashPassword = hashPassword;

const comparePassword = (password, hash) => {
	bcrypt.compare(password, hash, (err, result) => {
		return result;
	});
};
exports.comparePassword = comparePassword;
