import { version } from '../../package.json';
import { Router } from 'express';

import Order from '../models/order';
import User from '../models/user';
import Payment from '../models/payment';
import Driver from '../models/driver';

import { createOrder } from '../controllers/orders';

export default ({ config, db }) => {
	let api = Router();

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		return res.json({ version });
	});

	// User region

	api.post('/user/login', (req, res) => {
		const { email, password } = req.body;

		return User.findOne({ email }).then(user => res.json(user));
	});

	// Order Region

	api.post('/order/createOrder', (req, res) => createOrder(req, res));

	// User

	// Create User
	api.post('/user/createUser', (req, res) => {
		const {
			name,
			email,
			cpf,
			lastName,
			ddd,
			phone,
			push_token,
			password_hash
		} = req.body;

		const newUser = new User({
			name,
			email,
			lastName,
			ddd,
			phone,
			push_token,
			cpf,
			password_hash
		});
		return newUser.save().then(() => res.json(newUser));
	});

	//Update User By Id
	api.put('/user/:id', (req, res) => {
		var id = req.params.id;
		return User.findOne({ _id: id }).then(user => {
			user.name = req.body.name;
			user.email = req.body.email;
			user.lastName = req.body.lastName;
			user.ddd = req.body.ddd;
			user.phone = req.body.phone;
			user.push_token = req.body.push_token;
			user.cpf = req.body.cpf;
			user.password_hash = req.body.password_hash;
			return user.save().then(user => res.json(user));
		});
	});

	// Get User By Id
	api.get('/user/:id', (req, res) => {
		var id = req.params.id;
		return User.findOne({ _id: id }).then(user => res.json(user));
	});

	// Get All User
	api.get('/user/', (req, res) => {
		return User.find({}).then(user => res.json(user));
	});

	// Driver

	// Create driver
	api.post('/driver/createDriver', (req, res) => {
		const { name, lastName, ddd, phone, email, cpf, company, password_hash, status, current_location, push_token} = req.body;

		const newDriver = new Driver({
			name,
			lastName,
			ddd,
			phone,
			email,
			cpf,
			company,
			password_hash,
			status,
			current_location,
			push_token
		});
		return newDriver.save().then(() => res.json(newDriver));
	});

	// Get Driver By Id
	api.get('/driver/:id', (req, res) => {
		var id = req.params.id;
		return Driver.findOne({ _id: id }).then(driver => res.json(user));
	});

	// Get All Driver
	api.get('/driver/', (req, res) => {
		return Driver.find({}).then(driver => res.json(user));
	});

	// Payment

	//Create Payment
	api.post('/payment/createPayment', (req, res) => {
		const { client_id, number, cvc, name, expiry, type } = req.body;

		console.log('teste');
		const newPayment = new Payment({
			client_id,
			number,
			cvc,
			name,
			expiry,
			type
		});
		return newPayment
			.save()
			.then(() => res.json(newPayment))
			.catch(err => console.log(err));
	});

	return api;
};
