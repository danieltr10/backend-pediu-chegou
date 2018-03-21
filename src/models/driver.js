import mongoose from 'mongoose';

const DriverSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	cpf: {
		type: String,
		required: true
	},
	password_hash: {
		type: String,
		required: true
	},
	status: {
		type: String,
		enum: ['offline', 'idle', 'working'],
		default: false
	},
	current_location: {
		lat: Number,
		long: Number,
		updated_at: { type: Date, default: new Date() }
	}
});

export default mongoose.model('Driver', DriverSchema);
