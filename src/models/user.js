import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	name: {
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
	}
});

export default mongoose.model('User', UserSchema);
