import { version } from '../../package.json';
import { Router } from 'express';

import Order from '../models/order';
import User from '../models/user';
import Payment from '../models/payment';
import Driver from '../models/driver';

import ordersController from '../controllers/orders';

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

	api.post('/order/createOrder', (req, res) => ordersController.createOrder);

	// User

	// Create User
	api.post('/user/createUser', (req, res) => {
		const { name, email, cpf, password_hash } = req.body;

		const newUser = new User({
			name,
			email,
			cpf,
			password_hash
		});
		return newUser.save().then(() => res.json(newUser));
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
