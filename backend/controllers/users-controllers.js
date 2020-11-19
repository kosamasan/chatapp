const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
		const error = new HttpError('Something went wrong', 500);
		return next(error);
    }
    
    res.json({users: users.map(user => user.toObject({ getters: true }))});
};

const signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(HttpError('Invalid input', 422));
	}

	const { name, email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError('Something went wrong', 500);
		return next(error);
	}

	if (existingUser) {
		const error = new HttpError('User already exists', 422);
		return next(error);
	}

	const createdUser = new User({
		name,
		email,
		image: 'https://static.thenounproject.com/png/17241-200.png',
		password,
		places: [],
	});

	try {
		await createdUser.save();
	} catch (err) {
		const error = new HttpError('Something went wrong', 500);
		return next(error);
	}

	res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
	const { email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError('Something went wrong', 500);
		return next(error);
	}

	if (!existingUser || existingUser.password !== password) {
		return next(new HttpError('User not found.', 401));
	}

	res.json({ message: 'logged in' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
