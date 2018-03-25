import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
	client_id: {
		ref: 'User',
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	number: {
		type: String,
		required: true
	},
	cvc: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	expiry: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	}
});

export default mongoose.model('Payment', PaymentSchema);
