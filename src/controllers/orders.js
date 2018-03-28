import Order from '../models/order';
import User from '../models/user';
import Driver from '../models/driver';
import util from '../lib/util';

export const createOrder = (req, res) => {
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

	console.log('teste');
	return newOrder.save().then(() => {
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
	});
};

// Const aux methods

const findDriverForOrder = order => {
	return Driver.find({ status: 'idle' }).then(drivers => {
		const nearestDriver = getNearestDriver(order, drivers);
		return nearestDriver;
	});
};

const getNearestDriverForOrder = (order, drivers) => {
	var neaestDriver;
	var minDistance;
	drivers.forEach(driver => {
		const driverDistanceFromStore = util.calculateDistanceBetweenAddresses(
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
	// TODO: send notification to driver
};
