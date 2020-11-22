const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
		if (!token) {
			throw new Error('Authentication failed');
		}
	} catch (err) {
		const error = new HttpError('Authentication failed', 401);
		next(error);
	}
};
