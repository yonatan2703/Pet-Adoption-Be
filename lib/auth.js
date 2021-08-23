const jwt = require("jsonwebtoken");
const secretKey = process.env.AUTH_KEY;
function sign(data) {
	return jwt.sign(data, secretKey, { expiresIn: 3600 * 4 }, data);
}
exports.sign = sign;
