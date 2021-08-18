const jwt = require("jsonwebtoken");

const authenticate = () => {
	const secretKey = `:H2'&=8uCA+6b[hm`;
	return (req, res, next) => {
		try {
			const token = req.headers.authorization.replace("Bearer ", "");
			const decoded = jwt.verify(token, secretKey);
			req.decoded = decoded;
			next();
		} catch (error) {
			console.log(error);
			res.status(401).send({ message: "Failed to authenticate", error });
		}
	};
};
exports.authenticate = authenticate;
