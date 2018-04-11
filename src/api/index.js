import { version } from '../../package.json';
import { Router } from 'express';
import jwt from 'jsonwebtoken';

import Order from '../models/order';
import User from '../models/user';
import Payment from '../models/payment';
import Driver from '../models/driver';

import {
	createOrder,
	acceptOrder,
	getAllOrderFromUser,
	pendingOrders
} from '../controllers/orders';

export default ({ config, db }) => {
	let api = Router();

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		return res.json({ version });
	});

	// User region

	api.post('/user/login', (req, res) => {
		const { email, password } = req.body;
		return User.findOne({ email })
			.then(user => {
				if (user) {
					const sanitizedUser = { ...user.toJSON() };
					delete sanitizedUser.password_hash;
					jwt.sign(sanitizedUser, 'secret', (err, token) => {
						return res.json({ user: sanitizedUser, token });
					});
				} else {
					return Driver.findOne({ email })
						.then(driver => {
							if (driver) {
								const sanitizedDriver = { ...driver.toJSON() };
								delete sanitizedDriver.password_hash;
								jwt.sign(sanitizedDriver, 'secret', (err, token) => {
									return res.json({ user: sanitizedDriver, token });
								});
							}
						})
						.catch(err => console.log(err));
				}
			})
			.catch(err => console.log(err));
	});

	// Order Region

	api.post('/order/createOrder', (req, res) => createOrder(req, res));

	api.post('/order/', (req, res) => getAllOrderFromUser(req, res));

	api.post('/order/acceptOrder', (req, res) => acceptOrder(req, res));

	api.post('/order/pendingOrders', (req, res) => pendingOrders(req, res));

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
		return newUser.save().then(user => {
			const sanitizedUser = { ...user.toJSON() };
			delete sanitizedUser.password_hash;
			jwt.sign(sanitizedUser, 'secret', (err, token) => {
				return res.json({ user: sanitizedUser, token });
			});
		});
	});

	//Update User By Id
	api.put('/user/', (req, res) => {
		var email = req.body.email;
		return User.findOne({ email }).then(user => {
			user.name = req.body.name;
			user.email = req.body.email;
			user.lastName = req.body.lastName;
			user.ddd = req.body.ddd;
			user.phone = req.body.phone;
			user.push_token = req.body.push_token;
			user.cpf = req.body.cpf;
			if (req.body.password_hash != null) {
				user.password_hash = req.body.password_hash;
			}
			return user.save().then(user => {
				const sanitizedUser = { ...user.toJSON() };
				delete sanitizedUser.password_hash;
				jwt.sign(sanitizedUser, 'secret', (err, token) => {
					return res.json({ user: sanitizedUser, token });
				});
			});
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
		const {
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
		} = req.body;
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
		return newDriver.save().then(user => {
			const sanitizedUser = { ...user.toJSON() };
			delete sanitizedUser.password_hash;
			jwt.sign(sanitizedUser, 'secret', (err, token) => {
				return res.json({ user: sanitizedUser, token });
			});
		});
	});
	// Update Driver By Id
	api.put('/driver/:id', (req, res) => {
		var id = req.params.id;
		return Driver.findOne({ _id: id }).then(driver => {
			driver.name = req.body.name;
			driver.lastName = req.body.lastName;
			driver.ddd = req.body.ddd;
			driver.phone = req.body.phone;
			driver.email = req.body.email;
			driver.cpf = req.body.cpf;
			driver.company = req.body.company;
			driver.password_hash = req.body.password_hash;
			driver.status = req.body.status;
			driver.current_location = req.body.current_location;
			driver.push_token = req.body.push_token;
			return driver.save().then(driver => res.json(driver));
		});
	});

	// Get Driver By Id
	api.get('/driver/:id', (req, res) => {
		var id = req.params.id;
		return Driver.findOne({ _id: id }).then(driver => res.json(driver));
	});

	// Get All Drivers
	api.get('/driver/', (req, res) => {
		return Driver.find({}).then(driver => res.json(driver));
	});

	// Payment

	//Create Payment
	api.post('/payment/createPayment', (req, res) => {
		const { client_id, number, cvc, name, expiry, type } = req.body;
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
