import Order from '../models/order';
import User from '../models/user';
import Driver from '../models/driver';
import { calculateDistanceBetweenAddresses } from '../lib/util';
import Expo from 'expo-server-sdk';

export const acceptOrder = (req, res) => {
	const { driver_id, order_id } = req.body.requestData;

	if (!driver_id || !order_id) {
		return res.json({ error: 'Não foi possível aceitar o pedido!' });
	}

	return Order.update(
		{ _id: order_id },
		{ $set: { status: 'in_transit', driver_id } },
		() => {
			return Driver.update(
				{ _id: driver_id },
				{ $set: { status: 'working' } },
				() => {
					return res.json({ message: 'Pedido aceito com sucesso!' });
				}
			);
		}
	).catch(err => console.log(err));
};

export const createOrder = (req, res) => {
	const {
		client_id,
		driver_id,
		description,
		store_name,
		delivery_address,
		store_address
	} = req.body;

	const newOrder = new Order({
		client_id,
		driver_id,
		description,
		store_name,
		delivery_address,
		store_address
	});

	return newOrder
		.save()
		.then(() => {
			return findDriverForOrder(newOrder).then(nearestDriver => {
				if (!nearestDriver) {
					res.json({
						error: 'Não foi possível localizar um motorista no momento.'
					});
				} else {
					notifyNewOrderToDriver(nearestDriver, newOrder);
					return res.json(newOrder);
				}
			});
		})
		.catch(err => console.log(err));
};

export const getAllOrderFromUser = (req, res) => {
	var client_id = req.body._id;
	console.log(client_id);
	return Order.find({ client_id }).then(order => {
		console.log(order);
		res.json(order);
	});
};

export const pendingOrders = (req, res) => {
	return Order.find({ status: 'waiting' }).then(order => {
		return res.json(order);
	});
};

// Const aux methods

const findDriverForOrder = order => {
	return Driver.find({ status: 'idle' }).then(drivers => {
		const nearestDriver = getNearestDriverForOrder(order, drivers);
		return nearestDriver;
	});
};

const getNearestDriverForOrder = (order, drivers) => {
	var nearestDriver;
	var minDistance;
	drivers.forEach(driver => {
		const driverDistanceFromStore = calculateDistanceBetweenAddresses(
			order.store_address,
			driver.current_location
		);
		if (!nearestDriver || driverDistanceFromStore < minDistance) {
			minDistance = driverDistanceFromStore;
			nearestDriver = driver;
		}
	});

	return nearestDriver;
};

const notifyNewOrderToDriver = (driver, order) => {
	const pushToken = driver.push_token;
	if (pushToken && Expo.isExpoPushToken(pushToken)) {
		let expo = new Expo();
		let messages = [
			{
				to: pushToken,
				sound: 'default',
				body: 'Temos uma nova entrega pra você! 🛵 📦',
				data: { order }
			}
		];

		// The Expo push notification service accepts batches of notifications so
		// that you don't need to send 1000 requests to send 1000 notifications. We
		// recommend you batch your notifications to reduce the number of requests
		// and to compress them (notifications with similar content will get
		// compressed).
		let chunks = expo.chunkPushNotifications(messages);

		(async () => {
			// Send the chunks to the Expo push notification service. There are
			// different strategies you could use. A simple one is to send one chunk at a
			// time, which nicely spreads the load out over time:
			for (let chunk of chunks) {
				try {
					let receipts = await expo.sendPushNotificationsAsync(chunk);
					console.log(receipts);
				} catch (error) {
					console.error(error);
				}
			}
		})();
	}
};
