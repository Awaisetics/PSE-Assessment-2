// frontend/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    image: String,
}, {
    timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', userSchema);