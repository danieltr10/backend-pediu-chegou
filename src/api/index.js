import { version } from '../../package.json';
import { Router } from 'express';

import Order from '../models/order';
import User from '../models/user';

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

	return api;
};
