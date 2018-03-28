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
	description: {
		type: String
	},
	store_name: {
		type: String
	},
	store_address: {
		type: {
			full_address: String,
			lat: Number,
			long: Number
		},
		required: true
	},
	delivery_address: {
		type: {
			full_address: String,
			lat: Number,
			long: Number
		},
		required: true
	},
	status: {
		type: String,
		enum: ['waiting', 'in_transit', 'delivered'],
		default: false
	}
});

export default mongoose.model('Order', OrderSchema);
