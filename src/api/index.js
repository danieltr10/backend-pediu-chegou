import { version } from '../../package.json';
import { Router } from 'express';

import Order from '../models/order';

export default ({ config, db }) => {
	let api = Router();

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		return res.json({ version });
	});

	// Order Region

	api.post('/order/createOrder', (req, res) => {
		const {
			client_id,
			driver_id,
			description,
			store_name,
			delivery_address
		} = req.body;

		const newOrder = new Order({
			client_id,
			driver_id,
			description,
			store_name,
			delivery_address
		});
		return newOrder.save().then(() => res.json(newOrder));
	});

	return api;
};
