import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
	client_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	driver_id: {
		type: mongoose.Schema.Types.ObjectId
	},
	delivery_address: {
		type: {
			lat: Number,
			long: Number
		},
		required: true
	},
	path_addresses: [
		{
			lat: Number,
			long: Number
		}
	]
});

export default mongoose.model('Order', OrderSchema);
