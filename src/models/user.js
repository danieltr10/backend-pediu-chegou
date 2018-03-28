import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
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
	password_hash: {
		type: String,
		required: true
	},
	push_token: {
		type: String,
		required: true
	}
});

export default mongoose.model('User', UserSchema);
