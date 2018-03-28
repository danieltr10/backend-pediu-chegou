import mongoose from 'mongoose';

const DriverSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	ddd: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	cpf: {
		type: String,
		required: true,
		unique: true
	},
	company: {
		type: String,
		required: true
	},
	password_hash: {
		type: String,
		required: true
	},
	status: {
		type: String,
		enum: ['deactivated', 'idle', 'working'],
		default: 'idle'
	},
	current_location: {
		lat: Number,
		long: Number,
		updated_at: { type: Date, default: new Date() }
	},
	push_token: {
		type: String,
		required: true
	}
});

export default mongoose.model('Driver', DriverSchema);
