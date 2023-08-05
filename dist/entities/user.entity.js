import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    VATIN: {
        type: String,
        unique: true,
        required: true
    },
    access: {
        type: Boolean,
        default: false,
    },
    address: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    lastName: String,
    name: String,
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },
    ],
    password: String,
    phone: {
        type: Number,
        unique: true,
    },
    role: {
        type: String,
        enum: ['ADMIN', 'INSTALADOR'],
    },
}, { timestamps: true });
const User = mongoose.model('User', userSchema);
export default User;
