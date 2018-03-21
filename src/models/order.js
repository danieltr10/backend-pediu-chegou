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
	delivery_address: {
		type: {
			full_address: String,
			lat: Number,
			long: Number
		},
		required: true
	}
});

export default mongoose.model('Order', OrderSchema);
