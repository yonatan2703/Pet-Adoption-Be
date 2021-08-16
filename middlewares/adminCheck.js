const { query, SQL } = require("../data/db");

const adminCheck = () => {
	return async (req, res, next) => {
		try {
			const [userAdmin] = await query(
				SQL`SELECT role FROM users WHERE user_id = ${+req.decoded
					.userId};`
			);
			if (userAdmin.role !== "admin")
				res.status(401).send({
					message: "you dont have relevant authorization",
				});
			else next();
		} catch (err) {
			res.send({ error });
		}
	};
};
exports.adminCheck = adminCheck;
