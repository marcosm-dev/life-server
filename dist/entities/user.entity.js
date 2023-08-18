import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    token: String,
    name: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    VATIN: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: Number,
        unique: true,
    },
    address: String,
    zipCode: {
        type: String,
    },
    city: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['ADMIN', 'INSTALADOR'],
    },
    password: String,
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },
    ],
    access: {
        type: Boolean,
        default: false,
    },
    uuid: {
        type: String,
        required: false
    }
}, { timestamps: true });
const User = mongoose.model('User', userSchema);
export default User;
