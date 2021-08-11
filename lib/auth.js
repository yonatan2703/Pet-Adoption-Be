const jwt = require("jsonwebtoken");
const secretKey = `:H2'&=8uCA+6b[hm`;
function sign(data) {
	return jwt.sign(data, secretKey, { expiresIn: 3600 });
}
exports.sign = sign;
